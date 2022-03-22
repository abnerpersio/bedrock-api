import { NextFunction, Request, Response } from 'express';

import { LIMIT_REQUESTS_BY_SECOND } from '@config/bootstrap';

import { RequestError } from '../errors/request-error';
import MemoryIPStore from '../utils/memory-ip-store';

const options = {
  windowMs: 60 * 1000,
  max: parseInt(LIMIT_REQUESTS_BY_SECOND, 10) || 5,
  message: 'Too many requests, please try again later.',
};

const store = new MemoryIPStore(options.windowMs);

export default function RateLimiterMiddlware(req: Request, res: Response, next: NextFunction) {
  if (
    typeof store.incr !== 'function' ||
    typeof store.resetKey !== 'function' ||
    typeof store.decrement !== 'function'
  ) {
    throw new Error('The store is not valid.');
  }

  function rateLimit() {
    const requestIP = req.ip;

    store.incr(requestIP, async (current: number) => {
      const { max } = options;

      if (max && current > max) {
        if (!res.headersSent) {
          res.setHeader('Retry-After', Math.ceil(options.windowMs / 1000));
        }

        throw new RequestError(options.message, 429);
      }

      next();
      return null;
    });

    return null;
  }

  rateLimit.resetKey = store.resetKey.bind(store);
  rateLimit.resetIp = rateLimit.resetKey;
  rateLimit();
}
