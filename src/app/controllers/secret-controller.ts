import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { RequestError } from '@shared/errors/request-error';
import { SafeNotFound } from '@shared/errors/safe-not-found';
import { ISafe } from '@shared/interfaces/safe';
import * as secretInterfaces from '@shared/interfaces/secret';
import { decrypt } from '@shared/utils/crypto';

import { Safe, Secret } from '../models';
import { SafeRepository } from '../repositories/safe-repository';

export class SecretController {
  private Secret = Secret;

  private Safe = Safe;

  private safeRepository = new SafeRepository();

  list = async (req: Request, res: Response) => {
    const { id: owner } = req.auth;
    const { safe } = req.query;

    const safeExists = await this.safeRepository.findByUuid({
      uuid: safe as string,
      owner,
    });

    const safeId = new mongoose.mongo.ObjectId(safeExists?._id);

    const secretsFound: secretInterfaces.ISecret[] | null = await this.Secret.find({
      $or: [
        {
          safe: safeId,
        },
      ],
      owner,
    });

    if (!secretsFound) throw new RequestError('secrets not found from this safe', 404);

    res.json({
      success: true,
      data: secretsFound,
    });
  };

  search = async (
    req: Request<unknown, unknown, secretInterfaces.ISecretSearch>,
    res: Response,
  ) => {
    const { id } = req.auth;

    const safeFound: secretInterfaces.ISecret | null = await this.Secret.findOne({
      $and: [
        {
          $or: [
            {
              name: req.body.name,
            },
            {
              _id: req.body.id,
            },
            {
              uuid: req.body.uuid,
            },
          ],
        },
        {
          owner: id,
        },
      ],
    });

    if (!safeFound) throw new RequestError('secret not found', 404);

    res.json({
      success: true,
      data: safeFound,
    });
  };

  store = async (req: Request<unknown, unknown, secretInterfaces.ISecretCreate>, res: Response) => {
    const { id } = req.auth;
    const { params, key, safe } = req.body;

    const isSafeValid: ISafe | null = await this.Safe.findOne({
      $and: [
        {
          uuid: safe.uuid,
        },
        {
          owner: id,
        },
      ],
    });

    if (!isSafeValid) throw new SafeNotFound();

    const secretsList: secretInterfaces.ISecret[] | null = await this.Secret.find({
      _id: { $in: isSafeValid?.secrets },
    });

    // console.log(params);
    if (typeof params?.secret !== 'string' || typeof key !== 'string') {
      throw new RequestError('Invalid key in request query or secret in request body', 400);
    }

    const encryptListResults = secretsList?.map((item) => {
      try {
        const decoded = decrypt(item.secret ? item.secret : null, key);

        if (!decoded) return false;
        return true;
      } catch {
        return false;
      }
    });

    if (encryptListResults.some((item) => !item)) {
      throw new RequestError(
        'Different keys: another secret in this safe is saved with another key',
        400,
      );
    }

    const secretCreated: secretInterfaces.ISecret = await this.Secret.create({
      name: params.name,
      secret: {
        secret: params.secret,
        key,
      },
      safe: isSafeValid._id,
      owner: id,
    });

    await this.Safe.findOneAndUpdate(
      {
        _id: isSafeValid._id,
      },
      { $push: { secrets: secretCreated._id } },
    );

    res.json({
      success: true,
      data: secretCreated,
    });
  };

  update = async (
    req: Request<{ uuid: string }, unknown, secretInterfaces.ISecretUpdate>,
    res: Response,
  ) => {
    const { id } = req.auth;

    const secretExists: secretInterfaces.ISecret | null = await this.Secret.findOne({
      $and: [
        {
          uuid: req.params.uuid,
        },
        {
          owner: id,
        },
      ],
    });

    if (!secretExists) {
      throw new RequestError('secret not found', 404);
    }

    const secretUpdated: secretInterfaces.ISecret | null = await this.Secret.findOneAndUpdate(
      {
        $and: [
          {
            uuid: req.params.uuid,
          },
          {
            owner: id,
          },
        ],
      },
      {
        name: req.body?.name,
        secret: req.body?.secret,
      },
      {
        new: true,
      },
    );

    res.json({
      success: true,
      data: secretUpdated,
    });
  };

  delete = async (req: Request<{ uuid: string }>, res: Response) => {
    const { id } = req.auth;

    const secretExists: secretInterfaces.ISecret | null = await this.Secret.findOne({
      $and: [
        {
          uuid: req.params.uuid,
        },
        {
          owner: id,
        },
      ],
    });

    if (!secretExists) throw new RequestError('secret not found', 404);

    await this.Secret.findOneAndDelete({
      $and: [
        {
          uuid: req.params.uuid,
        },
        {
          owner: id,
        },
      ],
    });

    await this.Safe.findOneAndUpdate(
      {
        _id: secretExists.safe,
      },
      { $pull: { secrets: secretExists._id } },
    );

    res.sendStatus(204);
  };

  decode = async (
    req: Request<{ uuid: string }, unknown, secretInterfaces.IDecodeSearch>,
    res: Response,
  ) => {
    const { id } = req.auth;
    const { key } = req.body;

    if (!key || typeof key !== 'string') {
      throw new RequestError('Invalid key in request body', 400);
    }

    const secretExists: secretInterfaces.ISecret | null = await this.Secret.findOne(
      {
        $and: [
          {
            uuid: req.params.uuid,
          },
          {
            owner: id,
          },
        ],
      },
      'secret',
    );

    if (!secretExists) throw new RequestError('secret not found', 404);

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
