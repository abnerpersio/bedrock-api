import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { Safe } from '../models';

interface IForeignSecret {
  secret: mongoose.Types.ObjectId;
}

interface ISafe {
  _id?: mongoose.Types.ObjectId;
  owner?: mongoose.Types.ObjectId;
  uuid?: string;
  name?: string;
  password?: string;
  secrets?: IForeignSecret[];
}

export class SafeController {
  private Safe = Safe;

  list = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const safesFound: ISafe[]|null = await this.Safe.find({
      owner: id,
    });

    if (!safesFound) {
      res.status(404).json({
        success: false,
        message: 'safes not found from this user',
      });

      return;
    }

    res.json({
      success: true,
      data: safesFound,
    });
  };

  index = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const safeFound: ISafe|null = await this.Safe.findOne({
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
        message: 'safe not found',
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

    const safeCreated: ISafe = await this.Safe.create({
      name: req.body.name,
      owner: id,
    });

    res.json({
      success: true,
      data: safeCreated,
    });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const safeExists: ISafe|null = await this.Safe.findOne({
      $and: [
        {
          uuid: req.params.uuid,
        },
        {
          owner: id,
        },
      ],
    });

    if (!safeExists) {
      res.status(404).json({
        success: false,
        message: 'safe not found',
      });

      return;
    }

    const safeUpdated: ISafe|null = await this.Safe.findOneAndUpdate(
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
      },
      {
        new: true,
      },
    );

    res.json({
      success: true,
      data: safeUpdated,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const safeExists: ISafe|null = await this.Safe.findOne({
      $and: [
        {
          uuid: req.params.uuid,
        },
        {
          owner: id,
        },
      ],
    });

    if (!safeExists) {
      res.status(404).json({
        success: false,
        message: 'safe not found',
      });

      return;
    }

    await this.Safe.findOneAndDelete({
      $and: [
        {
          uuid: req.params.uuid,
        },
        {
          owner: id,
        },
      ],
    });

    res.sendStatus(204);
  };
}
