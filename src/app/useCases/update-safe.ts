import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SafeNotFound } from '../../shared/errors/safe-not-found';
import { SafeRepository } from '../repositories/safe-repository';

type Params = {
  auth: Auth;
  uuid: string;
  name: string;
};

export class UpdateSafeUseCase implements UseCase<Params> {
  constructor(private readonly safeRepository: SafeRepository) {}

  async execute(params: Params) {
    const { name, uuid } = params;
    const { id: owner } = params.auth;

    const safeExists = await this.safeRepository.findByUuid({ owner, uuid });

    if (!safeExists || !safeExists.uuid) throw new SafeNotFound();

    const safeUpdated = await this.safeRepository.update({
      uuid: safeExists.uuid,
      data: { name },
    });

    return CreateResponse.ok(safeUpdated);
  }
}
