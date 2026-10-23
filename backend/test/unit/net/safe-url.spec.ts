import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import { assertSafeWebhookUrl, isBlockedAddress, resolvePublicHost, safePost } from '../../../src/common/net/safe-url';

describe('SSRF protection for tenant-chosen URLs', () => {
  const original = process.env.ALLOW_PRIVATE_WEBHOOK_URLS;
  afterEach(() => {
    if (original === undefined) delete process.env.ALLOW_PRIVATE_WEBHOOK_URLS;
    else process.env.ALLOW_PRIVATE_WEBHOOK_URLS = original;
  });

  it.each([
    '127.0.0.1',
    '10.1.2.3',
    '172.20.0.5',
    '192.168.1.1',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '::1',
    'fd00::1',
    'fe80::1',
    '::ffff:127.0.0.1',
    '::ffff:169.254.169.254',
    '::ffff:7f00:1',
  ])('blocks %s', (address) => {
    expect(isBlockedAddress(address)).toBe(true);
  });

  it.each(['8.8.8.8', '1.1.1.1', '2606:4700:4700::1111', '::ffff:8.8.8.8'])('allows public %s', (address) => {
    expect(isBlockedAddress(address)).toBe(false);
  });

  it.each([
    'http://169.254.169.254/latest/meta-data/',
    'http://127.0.0.1:6379/',
    'http://localhost:4000/',
    'http://[::1]/',
    'http://10.0.0.5/hook',
  ])('refuses to save %s', async (url) => {
    await expect(assertSafeWebhookUrl(url)).rejects.toThrow();
  });

  it.each(['ftp://example.com/x', 'file:///etc/passwd', 'http://user:pass@example.com/'])('refuses %s', async (url) => {
    await expect(assertSafeWebhookUrl(url)).rejects.toThrow();
  });

  it('refuses an SMTP host on a private address', async () => {
    await expect(resolvePublicHost('127.0.0.1')).rejects.toThrow('public internet address');
  });

  describe('safePost', () => {
    let server: Server;
    let port: number;
    beforeAll(async () => {
      server = createServer((req, res) => {
        if (req.url === '/redirect') {
          res.writeHead(302, { Location: 'http://169.254.169.254/' });
          return res.end();
        }
        res.writeHead(200);
        res.end('x'.repeat(10_000));
      });
      await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
      port = (server.address() as AddressInfo).port;
    });
    afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

    it('will not connect to a loopback receiver', async () => {
      await expect(safePost(`http://127.0.0.1:${port}/`, '{}', {})).rejects.toThrow();
      await expect(safePost(`http://localhost:${port}/`, '{}', {})).rejects.toThrow(/non-public/);
    });

    it('connects when private addresses are explicitly allowed, caps the body and does not follow redirects', async () => {
      process.env.ALLOW_PRIVATE_WEBHOOK_URLS = 'true';
      const ok = await safePost(`http://localhost:${port}/`, '{}', {});
      expect(ok.ok).toBe(true);
      expect(ok.body.length).toBe(4096);

      const redirected = await safePost(`http://localhost:${port}/redirect`, '{}', {});
      expect(redirected.status).toBe(302);
      expect(redirected.ok).toBe(false);
    });
  });
});
