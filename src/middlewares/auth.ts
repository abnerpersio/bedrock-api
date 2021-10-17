import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const token = authorization?.split(' ')[1];

  if (!token) {
    res.status(400).json({
      success: false,
      message: 'authentication token is required',
    });
  }

  try {
    const verified = verifyToken(token);

    if (!verified) {
      res.status(401).json({
        success: false,
        message: 'invalid authentication',
      });

      return;
    }

    req.auth = {
      id: verified.id,
      email: verified.email,
      uuid: verified.uuid,
      token,
    };
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'invalid authentication',
    });

    return;
  }

  next();
}
