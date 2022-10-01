import { UserRepository } from '../repositories/user-repository';
import { DeleteUserUseCase } from '../useCases/delete-user';

export class DeleteUserController {
  static create() {
    const repository = new UserRepository();
    return new DeleteUserUseCase(repository);
  }
}
