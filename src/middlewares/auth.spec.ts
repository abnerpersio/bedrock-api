import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../server';

import { authToken, defaultUser } from '../test/fixtures/user';
import { mockUserModel } from '../controllers/UserController.spec';

export const mockAuth = () => {
  jwt.sign = jest.fn().mockReturnValue(authToken);
  jwt.verify = jest.fn().mockReturnValue(defaultUser);
};

describe('Login test', () => {
  beforeEach(() => {
    mockUserModel();
  });

  test('It should login correctly', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.token).not.toBeFalsy();
  });

  test('It should not login with invalid password', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
  });

  test('It should not login with invalid login', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
      });

    expect(response.status).toBe(400);
  });

  test('It should not authorize users without token', async () => {
    const response = await request(app)
      .get('/users');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('authentication token is required');
  });

  test('It should not login with invalid token data', async () => {
    jwt.verify = jest.fn().mockReturnValue(null);

    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('invalid authentication');
  });

  test('It should not login with expired token', async () => {
    jwt.verify = jest.fn(() => {
      throw new Error('invalid_token');
    });

    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('invalid authentication');
  });
});
