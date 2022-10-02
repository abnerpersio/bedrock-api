import { RequestError } from '@shared/errors/request-error';
import { SecretNotFound } from '@shared/errors/secret-not-found';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';
import { decrypt } from '@shared/utils/crypto';

import { SecretRepository } from '../repositories/secret-repository';

type Params = {
  auth: Auth;
  key?: string;
  uuid: string;
};

export class DecodeSecretUseCase implements UseCase<Params> {
  constructor(private readonly secretRepository: SecretRepository) {}

  async execute(params: Params) {
    const { id: owner } = params.auth;
    const { key, uuid } = params;

    if (!key) throw new RequestError('Invalid key in request body', 400);

    const secretExists = await this.secretRepository.findByUuid({ uuid, owner, select: 'secret' });
    if (!secretExists) throw new SecretNotFound();

    try {
      const decoded = decrypt(secretExists.secret ?? null, key);
      if (!decoded) throw new Error();

      return CreateResponse.ok(decoded);
    } catch (error) {
      throw new RequestError('Invalid key for this secret', 401);
    }
  }
}
