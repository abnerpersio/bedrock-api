import { SafeRepository } from '../repositories/safe-repository';
import { AddSafeUseCase } from '../useCases/add-safe';

export class AddSafeController {
  static create() {
    const repository = new SafeRepository();
    return new AddSafeUseCase(repository);
  }
}
