import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import canonicalize from 'canonicalize';
import * as crypto from 'crypto';
import { IJson } from '../interfaces';

interface EncryptedData {
  encryptedData: string;
  encryptedDataHash: string;
}

/**
 * Provides an interface to encrypt/decrypt/hash data
 */
@Injectable()
export class CryptoService {
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(private configService: ConfigService) {
    this.key = Buffer.from(
      configService.getOrThrow<string>('CRYPTO_AES_SECRET_KEY'),
      'hex',
    );
    this.iv = Buffer.from(
      configService.getOrThrow<string>('CRYPTO_AES_IV'),
      'hex',
    );
  }

  /**
   *
   * Interface to encrypt a text
   *
   * @param plainText - text to encrypt
   * @returns EncryptedData
   */
  encrypt(plainText: string): EncryptedData {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const hash = this.hashString(plainText);

    return { encryptedData: encrypted, encryptedDataHash: hash };
  }

  /**
   *
   * Interface to decrypt a text
   *
   * @param encryptedText - encrypted text
   * @returns String
   */
  decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  hashString(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  hashJson(obj: IJson): string {
    const canonical = canonicalize(obj)!;
    return this.hashString(canonical);
  }

  hashFileBuffer() {}
}
