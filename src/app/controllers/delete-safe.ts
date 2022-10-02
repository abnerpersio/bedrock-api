import { SafeRepository } from '../repositories/safe-repository';
import { DeleteSafeUseCase } from '../useCases/delete-safe';

export class DeleteSafeController {
  static create() {
    const repository = new SafeRepository();
    return new DeleteSafeUseCase(repository);
  }
}
