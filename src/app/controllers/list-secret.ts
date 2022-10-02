import { SafeRepository } from '../repositories/safe-repository';
import { SecretRepository } from '../repositories/secret-repository';
import { ListSecretUseCase } from '../useCases/list-secret';

export class ListSecretController {
  static create() {
    const secretRepo = new SecretRepository();
    const safeRepo = new SafeRepository();
    return new ListSecretUseCase(secretRepo, safeRepo);
  }
}
