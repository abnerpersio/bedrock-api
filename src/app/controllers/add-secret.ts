import { SafeRepository } from '../repositories/safe-repository';
import { SecretRepository } from '../repositories/secret-repository';
import { AddSecretUseCase } from '../useCases/add-secret';

export class AddSecretController {
  static create() {
    const secretRepo = new SecretRepository();
    const safeRepo = new SafeRepository();
    return new AddSecretUseCase(secretRepo, safeRepo);
  }
}
