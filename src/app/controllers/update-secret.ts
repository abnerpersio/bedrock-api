import { SecretRepository } from '../repositories/secret-repository';
import { UpdateSecretUseCase } from '../useCases/update-secret';

export class UpdateSecretController {
  static create() {
    const repository = new SecretRepository();
    return new UpdateSecretUseCase(repository);
  }
}
