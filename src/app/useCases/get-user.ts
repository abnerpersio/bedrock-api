import { RequestError } from '@shared/errors/request-error';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';

import { CreateResponse } from '../../shared/utils/create-reponse';
import { UserRepository } from '../repositories/user-repository';

type Params = {
  auth: Auth;
};

export class GetUserUseCase implements UseCase<Params> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: Params) {
    const { uuid } = params.auth;

    const userExists = await this.userRepository.findByUuid(uuid);

    if (!userExists) throw new RequestError('user not found', 404);

    return CreateResponse.ok(userExists);
  }
}
