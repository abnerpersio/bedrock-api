import { RequestError } from '@shared/errors/request-error';
import { SafeNotFound } from '@shared/errors/safe-not-found';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';

import { SafeRepository } from '../repositories/safe-repository';
import { SecretRepository } from '../repositories/secret-repository';

type Params = {
  auth: Auth;
  safe: string;
};

export class ListSecretUseCase implements UseCase<Params> {
  constructor(
    private readonly secretRepository: SecretRepository,
    private readonly safeRepository: SafeRepository,
  ) {}

  async execute(params: Params) {
    const { id: owner } = params.auth;
    const { safe } = params;

    const safeExists = await this.safeRepository.findByUuid({ uuid: safe, owner });
    if (!safeExists) throw new SafeNotFound();

    const secretsFound = await this.secretRepository.findAllByOwner({
      owner,
      safeId: safeExists._id,
    });

    if (!secretsFound.length) throw new RequestError('secrets not found from this safe', 404);

    return CreateResponse.ok(secretsFound);
  }
}
