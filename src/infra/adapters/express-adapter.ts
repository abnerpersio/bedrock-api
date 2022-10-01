import { Request, Response } from 'express';

import { UseCase } from '@shared/types/http';
import { Auth } from '@shared/types/user';

export class ExpressAdapter<T = unknown> {
  constructor(private readonly useCase: UseCase<T & { auth: Auth }>) {}

  adapt = async (req: Request<Partial<T>, unknown, Partial<T>, Partial<T>>, res: Response) => {
    const params = { ...req.body, ...req.query, ...req.params, auth: req.auth };

    const { status, success, data, message } = await this.useCase.execute(
      params as T & { auth: Auth },
    );

    if (message || data) {
      return res
        .status(status)
        .json({ success, message: message ?? undefined, data: data ?? undefined });
    }

    return res.sendStatus(status);
  };
}
