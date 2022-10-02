import { SafeRepository } from '../repositories/safe-repository';
import { SecretRepository } from '../repositories/secret-repository';
import { DeleteSecretUseCase } from '../useCases/delete-secret';

export class DeleteSecretController {
  static create() {
    const secretRepo = new SecretRepository();
    const safeRepo = new SafeRepository();
    return new DeleteSecretUseCase(secretRepo, safeRepo);
  }
}
