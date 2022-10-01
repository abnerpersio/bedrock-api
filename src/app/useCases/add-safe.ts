import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SafeRepository } from '../repositories/safe-repository';

type Params = {
  auth: Auth;
  name: string;
};

export class AddSafeUseCase implements UseCase<Params> {
  constructor(private readonly safeRepository: SafeRepository) {}

  async execute(params: Params) {
    const { name } = params;
    const { id: owner } = params.auth;

    const safeCreated = await this.safeRepository.create({ name, owner });

    return CreateResponse.created(safeCreated);
  }
}
