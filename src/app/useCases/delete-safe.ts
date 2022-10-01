import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SafeNotFound } from '../../shared/errors/safe-not-found';
import { SafeRepository } from '../repositories/safe-repository';

type Params = {
  auth: Auth;
  uuid: string;
};

export class DeleteSafeUseCase implements UseCase<Params> {
  constructor(private readonly safeRepository: SafeRepository) {}

  async execute(params: Params) {
    const { uuid } = params;
    const { id: owner } = params.auth;

    const safeExists = await this.safeRepository.findByUuid({ owner, uuid });

    if (!safeExists || !safeExists.uuid) throw new SafeNotFound();

    await this.safeRepository.delete({ uuid, owner });

    return CreateResponse.noContent();
  }
}
