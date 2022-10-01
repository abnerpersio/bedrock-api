import { RequestError } from '@shared/errors/request-error';
import { UseCase } from '@shared/types/http';
import { CreateResponse } from '@shared/utils/create-reponse';
import { verifiyHash } from '@shared/utils/hash';
import { generateToken } from '@shared/utils/jwt';

import { UserRepository } from '../repositories/user-repository';

type Params = {
  email: string;
  password: string;
};

export class LoginUseCase implements UseCase<Params> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: Params) {
    const { email, password } = params;

    if (!email || !password) throw new RequestError('email and password are required fields', 400);

    const user = await this.userRepository.findByEmail({ email, select: 'uuid email password' });
    if (!user) throw new RequestError('user with this email was not found', 404);

    const { password: userPassword, uuid } = user;

    const isPasswordVerified = verifiyHash(userPassword, password);

    if (!isPasswordVerified) throw new RequestError('wrong passsword', 401);

    const token = generateToken({ id: user._id, uuid, email });

    return CreateResponse.ok({ token });
  }
}
