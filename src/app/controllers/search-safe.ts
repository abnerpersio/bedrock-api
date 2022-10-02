import { SafeRepository } from '../repositories/safe-repository';
import { SearchSafeUseCase } from '../useCases/search-safe';

export class SearchSafeController {
  static create() {
    const repository = new SafeRepository();
    return new SearchSafeUseCase(repository);
  }
}
