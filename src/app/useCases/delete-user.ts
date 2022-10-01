import { RequestError } from '@shared/errors/request-error';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';

import { CreateResponse } from '../../shared/utils/create-reponse';
import { UserRepository } from '../repositories/user-repository';

type Params = {
  auth: Auth;
};

export class DeleteUserUseCase implements UseCase<Params> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: Params) {
    const {
      auth: { uuid },
    } = params;

    const userExists = await this.userRepository.findByUuid(uuid);
    if (!userExists) throw new RequestError('user not found', 404);

    await this.userRepository.delete(uuid);

    return CreateResponse.noContent();
  }
}
