import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../../../src/services/encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 'ENCRYPTION_KEY') {
                return '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
              }
              return undefined;
            },
          },
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt a string correctly', () => {
      const original = 'postgresql://user:password@localhost:5432/mydb';
      const encrypted = service.encrypt(original);
      const decrypted = service.decrypt(encrypted);

      expect(encrypted).not.toBe(original);
      expect(encrypted).toContain(':');
      expect(decrypted).toBe(original);
    });

    it('should produce different ciphertexts for the same input', () => {
      const text = 'test-string';
      const encrypted1 = service.encrypt(text);
      const encrypted2 = service.encrypt(text);

      expect(encrypted1).not.toBe(encrypted2);
      expect(service.decrypt(encrypted1)).toBe(text);
      expect(service.decrypt(encrypted2)).toBe(text);
    });

    it('should handle empty strings', () => {
      const encrypted = service.encrypt('');
      const decrypted = service.decrypt(encrypted);
      expect(decrypted).toBe('');
    });

    it('should handle special characters', () => {
      const text = 'p@$$w0rd!#%&*()_+{}|:<>?';
      const encrypted = service.encrypt(text);
      const decrypted = service.decrypt(encrypted);
      expect(decrypted).toBe(text);
    });
  });

  describe('generateApiKey', () => {
    it('should generate API key with sk_live_ prefix', () => {
      const key = service.generateApiKey();
      expect(key).toMatch(/^sk_live_[a-f0-9]{64}$/);
    });

    it('should generate unique keys', () => {
      const key1 = service.generateApiKey();
      const key2 = service.generateApiKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('generateWebhookSecret', () => {
    it('should generate a 64-character hex string', () => {
      const secret = service.generateWebhookSecret();
      expect(secret).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate unique secrets', () => {
      const secret1 = service.generateWebhookSecret();
      const secret2 = service.generateWebhookSecret();
      expect(secret1).not.toBe(secret2);
    });
  });
});
