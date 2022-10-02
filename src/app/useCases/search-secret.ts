import { SecretNotFound } from '@shared/errors/secret-not-found';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SecretRepository } from '../repositories/secret-repository';

type Params = {
  auth: Auth;
  id?: string;
  name?: string;
  uuid?: string;
};

export class SearchSecretUseCase implements UseCase<Params> {
  constructor(private readonly secretRepository: SecretRepository) {}

  async execute(params: Params) {
    const { id: owner } = params.auth;
    const { id: safeId, name, uuid } = params;

    const secretFound = await this.secretRepository.search({
      owner,
      id: safeId,
      name,
      uuid,
    });

    if (!secretFound) throw new SecretNotFound();

    return CreateResponse.ok(secretFound);
  }
}
