import { Request, Response } from 'express';
import * as safeInterfaces from '../interfaces/safe';
import { Safe } from '../models';

export class SafeController {
  private Safe = Safe;

  list = async (req: Request, res: Response) => {
    const { id } = req.auth;

    const safesFound: safeInterfaces.ISafe[] | null = await this.Safe.find({
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

  search = async (req: Request<unknown, unknown, safeInterfaces.ISafeSearch>, res: Response) => {
    const { id } = req.auth;

    const safeFound: safeInterfaces.ISafe | null = await this.Safe.findOne({
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
        message: 'safe not found',
      });

      return;
    }

    res.json({
      success: true,
      data: safeFound,
    });
  };

  store = async (req: Request<unknown, unknown, safeInterfaces.ISafeCreate>, res: Response) => {
    const { id } = req.auth;

    const safeCreated: safeInterfaces.ISafe = await this.Safe.create({
      name: req.body.name,
      owner: id,
    });

    res.json({
      success: true,
      data: safeCreated,
    });
  };

  update = async (req: Request<{ uuid: string }, unknown, { name?: string }>, res: Response) => {
    const { id } = req.auth;

    const safeExists: safeInterfaces.ISafe | null = await this.Safe.findOne({
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

    const safeUpdated: safeInterfaces.ISafe | null = await this.Safe.findOneAndUpdate(
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

  delete = async (req: Request<{ uuid: string }>, res: Response) => {
    const { id } = req.auth;

    const safeExists: safeInterfaces.ISafe | null = await this.Safe.findOne({
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
