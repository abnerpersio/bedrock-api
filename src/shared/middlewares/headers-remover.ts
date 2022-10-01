import { NextFunction, Request, Response } from 'express';

export function HeadersRemoverMiddleware(req: Request, res: Response, next: NextFunction) {
  res.removeHeader('X-Powered-By');
  next();
}
