import request from 'supertest';

import { mockAuth } from '@test-utils/auth';
import { defaultUser } from '@test-utils/fixtures/user';
import { mockUserModel } from '@test-utils/models/user';

import { server } from '../../../server';
import { User } from '../../models';

describe('UserController', () => {
  beforeEach(() => {
    mockUserModel();
    mockAuth();
  });

  async function mockAuthTokenRequest() {
    return request(server).post('/login').set('Content-Type', 'application/json').send({
      email: defaultUser.email,
      password: defaultUser.password,
    });
  }

  it('should create user', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(server)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe(defaultUser.email);
  });

  it('should not create user with existing email', async () => {
    const response = await request(server)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
        password: defaultUser.password,
      });

    expect(response.status).toBe(400);
  });

  it('should not create user without data', async () => {
    const response = await request(server)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: defaultUser.email,
      });

    expect(response.status).toBe(400);
  });

  it('should return logged user data', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server).get('/users').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(defaultUser.email);
  });

  it('should return 404 user not found /users', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(server).get('/users').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user not found');
  });

  it('should return 404 user not found in login', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const response = await request(server)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'invalidemail',
        password: defaultUser.password,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('user with this email was not found');
  });

  it('should delete user', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server).delete('/users').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not delete user 404', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;
    User.findOne = jest.fn().mockResolvedValue(null);

    const response = await request(server).delete('/users').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
