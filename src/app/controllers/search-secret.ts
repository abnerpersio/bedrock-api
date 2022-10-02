import { SecretRepository } from '../repositories/secret-repository';
import { SearchSecretUseCase } from '../useCases/search-secret';

export class SearchSecretController {
  static create() {
    const repository = new SecretRepository();
    return new SearchSecretUseCase(repository);
  }
}
