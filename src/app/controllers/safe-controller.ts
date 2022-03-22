import { Request, Response } from 'express';
import * as safeInterfaces from '@shared/interfaces/safe';
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
    const { id: userId } = req.auth;
    const { name, id: safeId, uuid } = req.body;

    const safeFound: safeInterfaces.ISafe | null = await this.Safe.findOne({
      $and: [
        {
          $or: [{ name }, { _id: safeId }, { uuid }],
        },
        { owner: userId },
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
    const { id: userId } = req.auth;

    const safeCreated: safeInterfaces.ISafe = await this.Safe.create({
      name: req.body.name,
      owner: userId,
    });

    res.json({
      success: true,
      data: safeCreated,
    });
  };

  update = async (req: Request<{ uuid: string }, unknown, { name?: string }>, res: Response) => {
    const { id: userId } = req.auth;
    const { uuid } = req.params;
    const { name } = req.body;

    const safeExists: safeInterfaces.ISafe | null = await this.Safe.findOne({
      $and: [{ uuid }, { owner: userId }],
    });

    if (!safeExists) {
      res.status(404).json({
        success: false,
        message: 'safe not found',
      });

      return;
    }

    const safeUpdated: safeInterfaces.ISafe | null = await this.Safe.findOneAndUpdate(
      { $and: [{ uuid }, { owner: userId }] },
      { name },
      { new: true },
    );

    res.json({
      success: true,
      data: safeUpdated,
    });
  };

  delete = async (req: Request<{ uuid: string }>, res: Response) => {
    const { id: userId } = req.auth;
    const { uuid } = req.params;

    const safeExists: safeInterfaces.ISafe | null = await this.Safe.findOne({
      $and: [{ uuid }, { owner: userId }],
    });

    if (!safeExists) {
      res.status(404).json({
        success: false,
        message: 'safe not found',
      });

      return;
    }

    await this.Safe.findOneAndDelete({
      $and: [{ uuid }, { owner: userId }],
    });

    res.sendStatus(204);
  };
}
