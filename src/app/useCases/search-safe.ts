import { SafeNotFound } from '@shared/errors/safe-not-found';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SafeRepository } from '../repositories/safe-repository';

type Params = {
  auth: Auth;
  name?: string;
  id?: string;
  uuid?: string;
};

export class SearchSafeUseCase implements UseCase<Params> {
  constructor(private readonly safeRepository: SafeRepository) {}

  async execute(params: Params) {
    const { name, id: safeId, uuid } = params;
    const { id: owner } = params.auth;

    const safe = await this.safeRepository.search({ owner, name, id: safeId, uuid });
    if (!safe) throw new SafeNotFound();

    return CreateResponse.ok(safe);
  }
}
