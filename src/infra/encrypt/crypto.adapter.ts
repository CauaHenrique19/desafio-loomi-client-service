import crypto from 'node:crypto';
import {
  GenerateRandomCharacters,
  GenerateRandomCharactersParameters,
} from '@client-service/data/protocols/encrypt';

export class CryptoAdapter implements GenerateRandomCharacters {
  async generateRandomCharacters(
    parameters: GenerateRandomCharactersParameters,
  ): Promise<string> {
    const randomBytes = crypto
      .randomBytes(16)
      .toString('hex')
      .slice(0, parameters.size);
    return randomBytes;
  }
}
