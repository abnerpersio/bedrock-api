import jwt from 'jsonwebtoken';

import { authToken, defaultUser } from './fixtures/user';

export const mockAuth = () => {
  jwt.sign = jest.fn().mockReturnValue(authToken);
  jwt.verify = jest.fn().mockReturnValue(defaultUser);
};
