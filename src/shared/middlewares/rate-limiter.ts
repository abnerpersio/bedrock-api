import { NextFunction, Request, Response } from 'express';

import { rateLimitOptions } from '@config/rate-limit';

import { RequestError } from '../errors/request-error';
import { MemoryIPStore } from '../utils/memory-ip-store';

const store = new MemoryIPStore(rateLimitOptions.windowMs);

export function RateLimiterMiddlware(req: Request, res: Response, next: NextFunction) {
  const { max } = rateLimitOptions;
  const requestIP = req.ip;

  const current = store.increment(requestIP);

  if (max && current > max) {
    if (!res.headersSent) {
      res.setHeader('Retry-After', Math.ceil(rateLimitOptions.windowMs / 1000));
    }

    throw new RequestError(rateLimitOptions.message, 429);
  }

  next();
  return null;
}
