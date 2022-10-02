import { SecretRepository } from '../repositories/secret-repository';
import { DecodeSecretUseCase } from '../useCases/decode-secret';

export class DecodeSecretController {
  static create() {
    const repository = new SecretRepository();
    return new DecodeSecretUseCase(repository);
  }
}
