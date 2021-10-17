import request from 'supertest';

import { User } from '../models';

import app from '../server';

import { defaultUser } from '../test/fixtures/user';
import { mockAuth } from '../auth.spec';

export const mockUserModel = () => {
  User.findById = jest.fn().mockResolvedValue(new User(defaultUser));
  User.findOne = jest.fn().mockResolvedValue(new User(defaultUser));
  User.create = jest.fn().mockResolvedValue(new User(defaultUser));
  User.findOneAndDelete = jest.fn().mockResolvedValue(true);
};

describe('User Controller', () => {
  beforeEach(() => {
    mockUserModel();
    mockAuth();
  });

  async function mockAuthTokenRequest() {
    return request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      });
  }

  test('It should create user', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(defaultUser.email);
  });

  test('It should not create user with existing email', async () => {
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      });

    expect(response.status).toBe(400);
  });

  test('It should not create user without data', async () => {
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
      });

    expect(response.status).toBe(400);
  });

  test('It should return logged user data', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(defaultUser.email);
  });

  test('It should return 404 user not found /users', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user not found');
  });

  test('It should return 404 user not found in login', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'invalidemail',
        password: defaultUser.password,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user with this email was not found');
  });

  test('It should delete user', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  test('It should not delete user 404', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
