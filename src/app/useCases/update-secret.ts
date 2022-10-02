import { SecretNotFound } from '@shared/errors/secret-not-found';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SecretRepository } from '../repositories/secret-repository';

type Params = {
  auth: Auth;
  uuid: string;
  name: string;
  secret: string;
};

export class UpdateSecretUseCase implements UseCase<Params> {
  constructor(private readonly secretRepository: SecretRepository) {}

  async execute(params: Params) {
    const { id: owner } = params.auth;
    const { uuid, name, secret } = params;

    const secretExists = await this.secretRepository.findByUuid({ uuid, owner });
    if (!secretExists || !secretExists.uuid) throw new SecretNotFound();

    const secretUpdated = await this.secretRepository.update({
      uuid: secretExists.uuid,
      data: { name, secret },
    });

    return CreateResponse.ok(secretUpdated);
  }
}
