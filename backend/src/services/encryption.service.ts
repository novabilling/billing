import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  Cipher,
  Decipher,
} from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly encryptionKey: Buffer;
  private readonly algorithm = 'aes-256-cbc' as const;

  constructor(private readonly configService: ConfigService) {
    const keyHex = this.configService.get<string>('ENCRYPTION_KEY');
    if (!keyHex) {
      throw new Error('ENCRYPTION_KEY environment variable is not set');
    }
    this.encryptionKey = Buffer.from(keyHex, 'hex');
  }

  encrypt(text: string): string {
    const iv: Buffer = randomBytes(16);
    const cipher: Cipher = createCipheriv(this.algorithm, this.encryptionKey, iv);

    let encrypted: string = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(encrypted: string): string {
    const [ivHex, encryptedText] = encrypted.split(':');

    if (!ivHex || !encryptedText) {
      throw new Error('Invalid encrypted text format. Expected "iv:encryptedData".');
    }

    const iv: Buffer = Buffer.from(ivHex, 'hex');
    const decipher: Decipher = createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      iv,
    );

    let decrypted: string = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  generateApiKey(): string {
    const randomPart: string = randomBytes(32).toString('hex');
    return `sk_live_${randomPart}`;
  }

  generateWebhookSecret(): string {
    return randomBytes(32).toString('hex');
  }
}
