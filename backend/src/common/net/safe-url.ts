import { BadRequestException } from '@nestjs/common';
import { lookup as dnsLookup, LookupAddress } from 'dns';
import { request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';
import { BlockList, isIP } from 'net';

/**
 * Outbound requests to addresses a tenant chooses (webhook URLs) must not
 * reach this deployment's own network: databases, Redis, cloud metadata.
 * The address is checked when the URL is saved and again on every delivery,
 * at connect time, so a DNS change cannot slip an internal address through.
 *
 * Self-hosters who deliver to their own private network can set
 * ALLOW_PRIVATE_WEBHOOK_URLS=true.
 */
const blocked = new BlockList();
for (const [net, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.88.99.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
] as const) {
  blocked.addSubnet(net, prefix, 'ipv4');
}
for (const [net, prefix] of [
  ['::', 128],
  ['::1', 128],
  ['64:ff9b::', 96],
  ['100::', 64],
  ['2001:db8::', 32],
  ['fc00::', 7],
  ['fe80::', 10],
  ['ff00::', 8],
] as const) {
  blocked.addSubnet(net, prefix, 'ipv6');
}

function privateAllowed(): boolean {
  return process.env.ALLOW_PRIVATE_WEBHOOK_URLS === 'true';
}

/** Whether an IP address is loopback, private, link-local or otherwise not public. */
export function isBlockedAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 0) return true;
  if (family === 6) {
    // IPv4-mapped (::ffff:a.b.c.d, or ::ffff:7f00:1): judge the IPv4 address.
    const lower = address.toLowerCase();
    const dotted = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (dotted) return blocked.check(dotted[1], 'ipv4');
    const hex = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (hex) {
      const hi = parseInt(hex[1], 16);
      const lo = parseInt(hex[2], 16);
      return blocked.check(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`, 'ipv4');
    }
    return blocked.check(address, 'ipv6');
  }
  return blocked.check(address, 'ipv4');
}

function parse(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new BadRequestException('Webhook URL is not a valid URL');
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new BadRequestException('Webhook URL must use http or https');
  }
  if (parsed.username || parsed.password) {
    throw new BadRequestException('Webhook URL must not contain credentials');
  }
  return parsed;
}

function resolveAll(hostname: string): Promise<LookupAddress[]> {
  return new Promise((resolve, reject) =>
    dnsLookup(hostname, { all: true, verbatim: true }, (err, addresses) => (err ? reject(err) : resolve(addresses))),
  );
}

/** Refuses a URL that is malformed or resolves to a non-public address. */
export async function assertSafeWebhookUrl(url: string): Promise<void> {
  const parsed = parse(url);
  if (privateAllowed()) return;
  const host = parsed.hostname.replace(/^\[|\]$/g, '');
  let addresses: LookupAddress[];
  try {
    addresses = isIP(host) ? [{ address: host, family: isIP(host) }] : await resolveAll(host);
  } catch {
    throw new BadRequestException(`Webhook URL host "${host}" could not be resolved`);
  }
  if (addresses.length === 0 || addresses.some((a) => isBlockedAddress(a.address))) {
    throw new BadRequestException('Webhook URL must point to a public internet address');
  }
}

/** DNS lookup for the HTTP client that refuses non-public addresses at connect time. */
function guardedLookup(
  hostname: string,
  options: object,
  callback: (err: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void,
): void {
  dnsLookup(hostname, { ...options, all: true, verbatim: true }, (err, addresses) => {
    if (err) return callback(err, '', 0);
    const list = addresses as LookupAddress[];
    const bad = !privateAllowed() && (list.length === 0 || list.some((a) => isBlockedAddress(a.address)));
    if (bad) {
      const error = new Error(`Refusing to connect to non-public address for ${hostname}`) as NodeJS.ErrnoException;
      error.code = 'EBLOCKEDADDRESS';
      return callback(error, '', 0);
    }
    if ((options as { all?: boolean }).all) return callback(null, list);
    callback(null, list[0].address, list[0].family);
  });
}

export interface SafePostResult {
  status: number;
  ok: boolean;
  /** At most 4 KB of the response body. */
  body: string;
}

const MAX_BODY = 4096;

/**
 * POST to a tenant-chosen URL: public addresses only (checked at connect
 * time), no redirects followed, a hard timeout, and a capped response body.
 */
export async function safePost(url: string, body: string, headers: Record<string, string>, timeoutMs = 10_000): Promise<SafePostResult> {
  const parsed = parse(url);
  const host = parsed.hostname.replace(/^\[|\]$/g, '');
  if (isIP(host) && !privateAllowed() && isBlockedAddress(host)) {
    throw new Error('Refusing to connect to a non-public address');
  }
  const send = parsed.protocol === 'https:' ? httpsRequest : httpRequest;
  return new Promise<SafePostResult>((resolve, reject) => {
    const req = send(
      parsed,
      {
        method: 'POST',
        headers: { ...headers, 'Content-Length': Buffer.byteLength(body).toString() },
        lookup: guardedLookup as never,
        timeout: timeoutMs,
      },
      (res) => {
        let received = '';
        res.setEncoding('utf8');
        res.on('data', (chunk: string) => {
          if (received.length < MAX_BODY) received += chunk.slice(0, MAX_BODY - received.length);
        });
        res.on('end', () => {
          const status = res.statusCode ?? 0;
          // Redirects are not followed: a 3xx is a failed delivery.
          resolve({ status, ok: status >= 200 && status < 300, body: received });
        });
        res.on('error', reject);
      },
    );
    req.on('timeout', () => req.destroy(new Error(`Timed out after ${timeoutMs} ms`)));
    req.on('error', reject);
    req.end(body);
  });
}

/** Resolves a host and returns one public address to connect to, or refuses it. */
export async function resolvePublicHost(host: string): Promise<string> {
  const bare = host.replace(/^\[|\]$/g, '');
  let addresses: LookupAddress[];
  try {
    addresses = isIP(bare) ? [{ address: bare, family: isIP(bare) }] : await resolveAll(bare);
  } catch {
    throw new BadRequestException(`Host "${bare}" could not be resolved`);
  }
  if (addresses.length === 0) throw new BadRequestException(`Host "${bare}" could not be resolved`);
  if (!privateAllowed() && addresses.some((a) => isBlockedAddress(a.address))) {
    throw new BadRequestException(`Host "${bare}" must be a public internet address`);
  }
  return addresses[0].address;
}
