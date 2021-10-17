import request from 'supertest';
import { Safe, Secret } from '../models';

import app from '../server';

import { defaultSecret } from '../test/fixtures/secret';
import { defaultUser } from '../test/fixtures/user';
import { mockSafeModel } from './SafeController.spec';
import { mockUserModel } from './UserController.spec';

export const mockSecretModel = () => {
  Secret.find = jest.fn().mockResolvedValue([new Secret(defaultSecret)]);
  Secret.findById = jest.fn().mockResolvedValue(new Secret(defaultSecret));
  Secret.findOne = jest.fn().mockResolvedValue(new Secret(defaultSecret));
  Secret.create = jest.fn().mockResolvedValue(new Secret(defaultSecret));
  Secret.findOneAndDelete = jest.fn().mockResolvedValue(true);
  Secret.findOneAndUpdate = jest.fn().mockResolvedValue(new Secret({
    ...defaultSecret,
    name: defaultSecret.updatedName,
    secret: defaultSecret.updatedSecret,
  }));
};

describe('Safe Controller', () => {
  beforeEach(() => {
    mockUserModel();
    mockSafeModel();
    mockSecretModel();
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

  test('It should create a secret successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .post('/secrets')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        safe: {
          uuid: defaultSecret.safe,
        },
        name: defaultSecret.name,
        secret: defaultSecret.secret,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSecret.name);
  });

  test('It should not create a secret 404 safe not found', async () => {
    Safe.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .post('/secrets')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        safe: {
          uuid: 'invalidsafeid',
        },
        name: defaultSecret.name,
        secret: defaultSecret.secret,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('safe not found');
  });

  test('It should get all secrets searching by user', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/secrets')
      .query({ owner: defaultUser._id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe(defaultSecret.name);
  });

  test('It should get all secrets searching by safe', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/secrets')
      .query({ safe: defaultSecret.safe })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe(defaultSecret.name);
  });

  test('It should not get all secrets without query', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/secrets')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  test('It should get 404 secrets not found', async () => {
    Secret.find = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/secrets')
      .query({ safe: 'invalidsafe' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('It should get a secret successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/secrets/search')
      .query({ name: defaultSecret.name })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSecret.name);
  });

  test('It should get 404 secret not found', async () => {
    Secret.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/secrets/search')
      .query({ name: 'invalidname' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('secret not found');
  });

  test('It should update a secret successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .put(`/secrets/${defaultSecret.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: defaultSecret.updatedName,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSecret.updatedName);
  });

  test('It should not update 404 error', async () => {
    Secret.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .put('/secrets/invalidsecret')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: defaultSecret.updatedName,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('secret not found');
  });

  test('It should delete a secret successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .delete(`/secrets/${defaultSecret.uuid}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  test('It should not delete 404 error', async () => {
    Secret.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .delete('/secrets/invalidsecret')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('secret not found');
  });
});
