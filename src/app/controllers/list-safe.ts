import { SafeRepository } from '../repositories/safe-repository';
import { ListSafeUseCase } from '../useCases/list-safe';

export class ListSafeController {
  static create() {
    const repository = new SafeRepository();
    return new ListSafeUseCase(repository);
  }
}
