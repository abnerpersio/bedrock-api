import * as jwt from 'jsonwebtoken';

import { JWT_SECRET } from '@config/bootstrap';

export const generateToken = (data: any): string =>
  jwt.sign(data, JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });

export const verifyToken = (token: string | undefined): any => {
  if (!token) {
    throw new Error('token not sent');
  }

  return jwt.verify(token, JWT_SECRET);
};
