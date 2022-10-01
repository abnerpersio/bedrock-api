import { SafeRepository } from '../repositories/safe-repository';
import { UpdateSafeUseCase } from '../useCases/update-safe';

export class UpdateSafeController {
  static create() {
    const repository = new SafeRepository();
    return new UpdateSafeUseCase(repository);
  }
}
