import { NextFunction, Request, Response } from 'express';

import { RequestError } from '../errors/request-error';
import { verifyToken } from '../utils/jwt';

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const token = authorization?.split(' ')[1];

  if (!token) {
    throw new RequestError('authentication token is required', 400);
  }

  try {
    const verified = verifyToken(token);

    if (!verified) throw new Error();

    req.auth = {
      id: verified.id,
      email: verified.email,
      uuid: verified.uuid,
      token,
    };
  } catch (error) {
    throw new RequestError('invalid authentication', 401);
  }

  next();
}
