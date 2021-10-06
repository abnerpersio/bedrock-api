import { NextFunction, Request, Response } from 'express';

export default function HeadersRemoverMiddleware(req: Request, res: Response, next: NextFunction) {
  res.removeHeader('X-Powered-By');
  next();
}
