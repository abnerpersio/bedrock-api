import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { Safe, Secret } from '../models';

interface ISecret {
  _id?: mongoose.Types.ObjectId;
  safe?: mongoose.Types.ObjectId;
  uuid?: string;
  name?: string;
  secret?: string;
}

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

    const secretsFound: ISecret[]|null = await this.Secret.find({
      $and: [
        {
          $or: [
            {
              safe: req.query.safe,
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

  index = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const safeFound: ISecret|null = await this.Secret.findOne({
      $and: [
        {
          $or: [
            {
              name: req.query.name,
            },
            {
              _id: req.query.id,
            },
            {
              uuid: req.query.uuid,
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

  store = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const isSafeValid = await this.Safe.findOne({
      $and: [
        {
          uuid: req.body?.safe?.uuid,
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

    const secretCreated: ISecret = await this.Secret.create({
      name: req.body.name,
      secret: req.body.secret,
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

  update = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const secretExists: ISecret|null = await this.Secret.findOne({
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

    const secretUpdated: ISecret|null = await this.Secret.findOneAndUpdate(
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

  delete = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const secretExists: ISecret|null = await this.Secret.findOne({
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
}
