import { UserRepository } from '../repositories/user-repository';
import { GetUserUseCase } from '../useCases/get-user';

export class GetUserController {
  static create() {
    const repository = new UserRepository();
    return new GetUserUseCase(repository);
  }
}
