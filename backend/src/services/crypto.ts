import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Encryption for stored credentials. New values use AES-256-GCM, which also
 * detects tampering: "v2:<iv>:<tag>:<ciphertext>" (hex). Values written
 * before are AES-256-CBC, "<iv>:<ciphertext>", and still decrypt.
 */
const V2 = 'v2';

export function encryptValue(text: string, keyHex: string): string {
  const key = Buffer.from(keyHex, 'hex');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return [V2, iv.toString('hex'), cipher.getAuthTag().toString('hex'), data.toString('hex')].join(':');
}

export function decryptValue(encrypted: string, keyHex: string): string {
  const key = Buffer.from(keyHex, 'hex');
  const parts = encrypted.split(':');
  if (parts[0] === V2) {
    const [, ivHex, tagHex, dataHex] = parts;
    if (!ivHex || !tagHex || dataHex === undefined) throw new Error('Invalid encrypted value');
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
  }
  const [ivHex, dataHex] = parts;
  if (!ivHex || !dataHex) throw new Error('Invalid encrypted text format. Expected "iv:encryptedData".');
  const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(ivHex, 'hex'));
  return decipher.update(dataHex, 'hex', 'utf8') + decipher.final('utf8');
}
