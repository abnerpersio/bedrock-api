import { Request, Response } from 'express';

import { RequestError } from '@shared/errors/request-error';
import { SafeNotFound } from '@shared/errors/safe-not-found';
import { decrypt } from '@shared/utils/crypto';

import { SecretNotFound } from '../../shared/errors/secret-not-found';
import {
  IDecodeSearch,
  ISecretCreate,
  ISecretSearch,
  ISecretUpdate,
} from '../../shared/interfaces/secret';
import { SafeRepository } from '../repositories/safe-repository';
import { SecretRepository } from '../repositories/secret-repository';

export class SecretController {
  private readonly safeRepository = new SafeRepository();
  private readonly secretRepository = new SecretRepository();

  list = async (req: Request, res: Response) => {
    const { id: owner } = req.auth;
    const { safe } = req.query;

    const safeExists = await this.safeRepository.findByUuid({
      uuid: safe as string,
      owner,
    });

    const secretsFound = await this.secretRepository.findAllByOwner({
      owner,
      safeId: safeExists?._id,
    });

    if (!secretsFound) throw new RequestError('secrets not found from this safe', 404);

    res.json({
      success: true,
      data: secretsFound,
    });
  };

  search = async (req: Request<unknown, unknown, ISecretSearch>, res: Response) => {
    const { id: owner } = req.auth;
    const { id: safeId, name, uuid } = req.body;

    const secretFound = await this.secretRepository.search({
      owner,
      id: safeId,
      name,
      uuid,
    });

    if (!secretFound) throw new SecretNotFound();

    res.json({
      success: true,
      data: secretFound,
    });
  };

  store = async (req: Request<unknown, unknown, ISecretCreate>, res: Response) => {
    const { id: owner } = req.auth;
    const {
      params: { name, secret },
      key,
      safe,
    } = req.body;

    const isSafeValid = await this.safeRepository.findByUuid({
      owner,
      uuid: safe.uuid,
    });

    if (!isSafeValid || !isSafeValid._id) throw new SafeNotFound();

    const secretsList = await this.secretRepository.findAllByIds(isSafeValid.secrets);

    if (!secret || !key) {
      throw new RequestError('Invalid key in request query or secret in request body', 400);
    }

    if (!secretsList) return;

    const encryptListResults = secretsList?.map((item) => {
      try {
        const { secret = null } = item;

        if (!decrypt(secret, key)) return false;
        return true;
      } catch {
        return false;
      }
    });

    if (!encryptListResults.every(Boolean)) {
      throw new RequestError(
        'Different keys: another secret in this safe is saved with another key',
        400,
      );
    }

    const secretCreated = await this.secretRepository.create({
      name,
      secret,
      key,
      safeId: isSafeValid._id,
      owner,
    });

    if (!secretCreated._id) throw new RequestError('error when creating secret', 500);

    await this.safeRepository.addSecret(isSafeValid._id, secretCreated._id);

    res.json({
      success: true,
      data: secretCreated,
    });
  };

  update = async (req: Request<{ uuid: string }, unknown, ISecretUpdate>, res: Response) => {
    const { id: owner } = req.auth;
    const { uuid } = req.params;
    const { name, secret } = req.body;

    const secretExists = await this.secretRepository.findByUuid({
      uuid,
      owner,
    });

    if (!secretExists || !secretExists.uuid) throw new SecretNotFound();

    const secretUpdated = await this.secretRepository.update({
      uuid: secretExists.uuid,
      data: {
        name,
        secret,
      },
    });

    res.json({
      success: true,
      data: secretUpdated,
    });
  };

  delete = async (req: Request<{ uuid: string }>, res: Response) => {
    const { id: owner } = req.auth;
    const { uuid } = req.params;

    const secretExists = await this.secretRepository.findByUuid({
      uuid,
      owner,
    });

    if (!secretExists || !secretExists.uuid || !secretExists._id) throw new SecretNotFound();

    await this.secretRepository.delete(secretExists.uuid);
    await this.safeRepository.deleteSecret(secretExists.safe, secretExists._id);

    res.sendStatus(204);
  };

  decode = async (req: Request<{ uuid: string }, unknown, IDecodeSearch>, res: Response) => {
    const { id: owner } = req.auth;
    const { key } = req.body;
    const { uuid } = req.params;

    if (!key) throw new RequestError('Invalid key in request body', 400);

    const secretExists = await this.secretRepository.findByUuid({
      uuid,
      owner,
      select: 'secret',
    });

    if (!secretExists) throw new SecretNotFound();

    try {
      const decoded = decrypt(secretExists.secret ?? null, key);
      if (!decoded) throw new Error();

      res.json({
        success: true,
        data: decoded,
      });
    } catch (error) {
      throw new RequestError('Invalid key for this secret', 401);
    }
  };
}
