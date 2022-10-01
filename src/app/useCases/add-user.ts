import { RequestError } from '@shared/errors/request-error';
import { UseCase } from '@shared/types/http';
import { CreateResponse } from '@shared/utils/create-reponse';

import { UserRepository } from '../repositories/user-repository';

type Params = {
  email: string;
  password: string;
};

export class AddUserUseCase implements UseCase<Params> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: Params) {
    const { email, password } = params;

    if (!email || !password) throw new RequestError('email and password are required fields', 400);

    const userExists = await this.userRepository.findByEmail({ email });
    if (userExists) throw new RequestError('user with this email already exists', 400);

    const { password: pass, ...user } = await this.userRepository.create({ email, password });

    return CreateResponse.ok(user);
  }
}
