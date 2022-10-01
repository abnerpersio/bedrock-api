import { UserRepository } from '../repositories/user-repository';
import { AddUserUseCase } from '../useCases/add-user';

export class AddUserController {
  static create() {
    const repository = new UserRepository();
    return new AddUserUseCase(repository);
  }
}
