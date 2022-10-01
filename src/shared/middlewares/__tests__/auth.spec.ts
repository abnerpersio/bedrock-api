import jwt from 'jsonwebtoken';
import request from 'supertest';

import { defaultUser } from '@test-utils/fixtures/user';
import { mockUserModel } from '@test-utils/models/user';

import { server } from '../../../server';

describe('Login test', () => {
  beforeEach(() => {
    mockUserModel();
  });

  it('should login correctly', async () => {
    const response = await request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.token).not.toBeFalsy();
  });

  it('should not login with invalid password', async () => {
    const response = await request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });

  it('should not login with invalid login', async () => {
    const response = await request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
      });

    expect(response.status).toBe(400);
  });

  it('should not authorize users without token', async () => {
    const response = await request(server).get('/users');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('authentication token is required');
  });

  it('should not login with invalid token data', async () => {
    jwt.verify = jest.fn().mockReturnValue(null);

    const response = await request(server)
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('invalid authentication');
  });

  it('should not login with expired token', async () => {
    jwt.verify = jest.fn(() => {
      throw new Error('invalid_token');
    });

    const response = await request(server)
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('invalid authentication');
  });
});
