import { UserRepository } from '../repositories/user-repository';
import { LoginUseCase } from '../useCases/login';

export class LoginController {
  static create() {
    const repository = new UserRepository();
    return new LoginUseCase(repository);
  }
}
