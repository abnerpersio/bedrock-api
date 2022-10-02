import { RequestError } from '@shared/errors/request-error';
import { SafeNotFound } from '@shared/errors/safe-not-found';
import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';
import { CreateResponse } from '@shared/utils/create-reponse';
import { decrypt } from '@shared/utils/crypto';

import { SafeRepository } from '../repositories/safe-repository';
import { SecretRepository } from '../repositories/secret-repository';

type Params = {
  auth: Auth;
  params: {
    name: string;
    secret: string;
  };
  safe: {
    uuid: string;
  };
  key: string;
};

export class AddSecretUseCase implements UseCase<Params> {
  constructor(
    private readonly secretRepository: SecretRepository,
    private readonly safeRepository: SafeRepository,
  ) {}

  async execute(params: Params) {
    const { id: owner } = params.auth;
    const { key, safe } = params;
    const { name, secret } = params.params;

    const isSafeValid = await this.safeRepository.findByUuid({ owner, uuid: safe.uuid });
    if (!isSafeValid || !isSafeValid._id) throw new SafeNotFound();

    const secretsList = await this.secretRepository.findAllByIds(isSafeValid.secrets);

    if (!secret || !key)
      throw new RequestError('Invalid key in request query or secret in request body', 400);

    const encryptedList = secretsList.map((item) => {
      try {
        const { secret = null } = item;

        if (!decrypt(secret, key)) return false;
        return true;
      } catch {
        return false;
      }
    });

    if (!encryptedList.every(Boolean))
      throw new RequestError(
        'Different keys: another secret in this safe is saved with another key',
        400,
      );

    const secretCreated = await this.secretRepository.create({
      name,
      secret,
      key,
      safeId: isSafeValid._id,
      owner,
    });

    if (!secretCreated._id) throw new RequestError('error when creating secret', 500);

    await this.safeRepository.addSecret(isSafeValid._id, secretCreated._id);

    return CreateResponse.created(secretCreated);
  }
}
