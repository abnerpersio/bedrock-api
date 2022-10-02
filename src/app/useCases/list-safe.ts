import { SafeNotFound } from '@shared/errors/safe-not-found';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SafeRepository } from '../repositories/safe-repository';

type Params = {
  auth: Auth;
};

export class ListSafeUseCase implements UseCase<Params> {
  constructor(private readonly safeRepository: SafeRepository) {}

  async execute(params: Params) {
    const { id: owner } = params.auth;

    const safesFound = await this.safeRepository.findAllByOwner(owner);
    if (!safesFound.length) throw new SafeNotFound();

    return CreateResponse.ok(safesFound);
  }
}
