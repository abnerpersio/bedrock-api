import { Request, Response } from 'express';
import { ISafe } from '../interfaces/safe';
import * as secretInterfaces from '../interfaces/secret';
import { Safe, Secret } from '../models';
import cipher from '../utils/cipher';

export class SecretController {
  private Secret = Secret;

  private Safe = Safe;

  list = async (req: Request, res: Response) => {
    const { id } = req.auth;

    if (!req.query.safe && !req.query.owner) {
      res.status(400).json({
        success: false,
        message: 'safe or owner is missing in query params',
      });

      return;
    }

    const safeId = (
      await Safe.findOne({
        uuid: req.query.safe,
      })
    )?.toObject()._id;

    const secretsFound: secretInterfaces.ISecret[] | null = await this.Secret.find({
      $and: [
        {
          $or: [
            {
              safe: safeId,
            },
            {
              owner: req.query.owner,
            },
          ],
        },
        {
          owner: id,
        },
      ],
    });

    if (!secretsFound) {
      res.status(404).json({
        success: false,
        message: 'secrets not found from this safe',
      });

      return;
    }

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

    if (!safeFound) {
      res.status(404).json({
        success: false,
        message: 'secret not found',
      });

      return;
    }

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

    if (!isSafeValid) {
      res.status(404).json({
        success: false,
        message: 'safe not found',
      });

      return;
    }

    const secretsList: secretInterfaces.ISecret[] | null = await this.Secret.find({
      _id: { $in: isSafeValid?.secrets },
    });

    if (typeof params.secret !== 'string' || typeof key !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Invalid key in request query or secret in request body',
      });

      return;
    }

    const encryptListResults = secretsList?.map((item) => {
      try {
        const decoded = cipher.decrypt(item.secret ? item.secret : null, key);

        if (!decoded) return false;
        return true;
      } catch {
        return false;
      }
    });

    if (encryptListResults.some((item) => !item)) {
      res.status(400).json({
        success: true,
        message: 'Different keys: another secret in this safe is saved with another key',
      });

      return;
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
      res.status(404).json({
        success: false,
        message: 'secret not found',
      });

      return;
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

    if (!secretExists) {
      res.status(404).json({
        success: false,
        message: 'secret not found',
      });

      return;
    }

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
      res.status(400).json({
        success: false,
        message: 'Invalid key in request query',
      });

      return;
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

    if (!secretExists) {
      res.status(404).json({
        success: false,
        message: 'secret not found',
      });

      return;
    }

    try {
      const decoded = cipher.decrypt(secretExists.secret ? secretExists.secret : null, key);

      if (!decoded) {
        throw new Error();
      }

      res.json({
        success: true,
        data: decoded,
      });
    } catch {
      res.status(401).json({
        success: false,
        message: 'Invalid key for this secret',
      });
    }
  };
}