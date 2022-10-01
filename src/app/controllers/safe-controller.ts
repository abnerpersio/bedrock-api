import { Request, Response } from 'express';

import { SafeNotFound } from '@shared/errors/safe-not-found';
import * as safeInterfaces from '@shared/types/safe';

import { SafeRepository } from '../repositories/safe-repository';

export class SafeController {
  constructor(private readonly safeRepository: SafeRepository) {}

  list = async (req: Request, res: Response) => {
    const { id: owner } = req.auth;

    const safesFound = await this.safeRepository.findAllByOwner(owner);

    if (!safesFound) throw new SafeNotFound();

    res.json({
      success: true,
      data: safesFound,
    });
  };

  search = async (req: Request<unknown, unknown, safeInterfaces.SafeSearch>, res: Response) => {
    const { id: owner } = req.auth;
    const { name, id: safeId, uuid } = req.body;

    const safeFound = await this.safeRepository.search({
      owner,
      name,
      id: safeId,
      uuid,
    });

    if (!safeFound) throw new SafeNotFound();

    res.json({
      success: true,
      data: safeFound,
    });
  };

  store = async (req: Request<unknown, unknown, safeInterfaces.SafeCreate>, res: Response) => {
    const { id: owner } = req.auth;
    const { name } = req.body;

    const safeCreated = await this.safeRepository.create({ name, owner });

    res.json({
      success: true,
      data: safeCreated,
    });
  };

  update = async (req: Request<{ uuid: string }, unknown, { name?: string }>, res: Response) => {
    const { id: owner } = req.auth;
    const { uuid } = req.params;
    const { name } = req.body;

    const safeExists = await this.safeRepository.findByUuid({
      owner,
      uuid,
    });

    if (!safeExists || !safeExists.uuid) throw new SafeNotFound();

    const safeUpdated = await this.safeRepository.update({
      uuid: safeExists.uuid,
      data: {
        name,
      },
    });

    res.json({
      success: true,
      data: safeUpdated,
    });
  };

  delete = async (req: Request<{ uuid: string }>, res: Response) => {
    const { id: owner } = req.auth;
    const { uuid } = req.params;

    const safeExists = await this.safeRepository.findByUuid({
      uuid,
      owner,
    });

    if (!safeExists || !safeExists.uuid) throw new SafeNotFound();

    await this.safeRepository.delete({
      uuid,
      owner,
    });

    res.sendStatus(204);
  };
}
