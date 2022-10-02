import { SecretNotFound } from '@shared/errors/secret-not-found';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SafeRepository } from '../repositories/safe-repository';
import { SecretRepository } from '../repositories/secret-repository';

type Params = {
  auth: Auth;
  uuid: string;
};

export class DeleteSecretUseCase implements UseCase<Params> {
  constructor(
    private readonly secretRepository: SecretRepository,
    private readonly safeRepository: SafeRepository,
  ) {}

  async execute(params: Params) {
    const { id: owner } = params.auth;
    const { uuid } = params;

    const secretExists = await this.secretRepository.findByUuid({ uuid, owner });
    if (!secretExists || !secretExists.uuid || !secretExists._id) throw new SecretNotFound();

    await this.secretRepository.delete(secretExists.uuid);
    await this.safeRepository.deleteSecret(secretExists.safe, secretExists._id);

    return CreateResponse.noContent();
  }
}
