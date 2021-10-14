import { NextFunction, Request, Response } from 'express';
import MemoryIPStore from '../utils/memory-ip-store';

const options = {
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
  statusCode: 429,
};

const store = new MemoryIPStore(options.windowMs);

export default function RateLimiterMiddlware(req: Request, res: Response, next: NextFunction) {
  if (
    typeof store.incr !== 'function'
    || typeof store.resetKey !== 'function'
    || typeof store.decrement !== 'function'
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

        res.status(options.statusCode).json({ message: options.message });
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