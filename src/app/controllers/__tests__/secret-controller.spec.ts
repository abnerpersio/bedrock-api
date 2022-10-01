import request from 'supertest';

import * as cipher from '@shared/utils/crypto';
import { defaultSafe } from '@test-utils/fixtures/safe';
import { defaultSecret } from '@test-utils/fixtures/secret';
import { defaultUser } from '@test-utils/fixtures/user';
import { mockSafeModel } from '@test-utils/models/safe';
import { mockSecretModel } from '@test-utils/models/secret';
import { mockUserModel } from '@test-utils/models/user';

import { server } from '../../../server';
import { Safe, Secret } from '../../models';
import { SafeController } from '../safe-controller';

describe(SafeController.name, () => {
  beforeEach(() => {
    mockUserModel();
    mockSafeModel();
    mockSecretModel();
  });

  async function mockAuthTokenRequest() {
    return request(server).post('/login').set('Content-Type', 'application/json').send({
      email: defaultUser.email,
      password: defaultUser.password,
    });
  }

  it('should create a secret successfully', async () => {
    jest.spyOn(cipher, 'decrypt').mockReturnValue(defaultSecret.secret);

    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/secrets')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        safe: {
          uuid: defaultSecret.safe,
        },
        params: {
          name: defaultSecret.name,
          secret: defaultSecret.secret,
        },
        key: defaultSecret.key,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSecret.name);
  });

  it('should not create a secret without encryption key', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/secrets')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        safe: {
          uuid: defaultSecret.safe,
        },
        params: {
          name: defaultSecret.name,
          secret: defaultSecret.secret,
        },
      });

    expect(response.status).toBe(400);
  });

  it('should not create a secret 404 safe not found', async () => {
    Safe.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/secrets')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        safe: {
          uuid: 'invalidsafeid',
        },
        params: {
          name: defaultSecret.name,
          secret: defaultSecret.secret,
        },
        key: defaultSecret.key,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('safe not found');
  });

  it('should get all user secrets', async () => {
    Secret.find = jest
      .fn()
      .mockResolvedValue([new Secret(defaultSecret), new Secret(defaultSecret)]);

    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server).get('/secrets').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  it('should get all secrets searching by safe', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .get('/secrets')
      .query({ safe: defaultSafe.uuid })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe(defaultSecret.name);
    expect(response.body.data).toHaveLength(1);
  });

  it('should get 404 secrets not found', async () => {
    Secret.find = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .get('/secrets')
      .query({ safe: 'invalidsafe' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should get a secret successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/secrets/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: defaultSecret.name });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSecret.name);
  });

  it('should get 404 secret not found', async () => {
    Secret.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/secrets/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'invalidname' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('secret not found');
  });

  it('should update a secret successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .put(`/secrets/${defaultSecret.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: defaultSecret.updatedName,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSecret.updatedName);
  });

  it('should not update 404 error', async () => {
    Secret.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .put('/secrets/invalidsecret')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: defaultSecret.updatedName,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('secret not found');
  });

  it('should delete a secret successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .delete(`/secrets/${defaultSecret.uuid}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not delete 404 error', async () => {
    Secret.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .delete('/secrets/invalidsecret')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('secret not found');
  });

  it('should decode a secret with valid encryption key', async () => {
    jest.spyOn(cipher, 'decrypt').mockReturnValue(defaultSecret.secret);

    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post(`/secrets/${defaultSecret.uuid}/decode`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ key: defaultSecret.key });

    expect(response.status).toBe(200);
    expect(response.body.data).toBe(defaultSecret.secret);
  });

  it('should not decode a secret with invalid encryption key', async () => {
    jest.spyOn(cipher, 'decrypt').mockReturnValue(null);

    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post(`/secrets/${defaultSecret.uuid}/decode`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should get 401 decoding with invalid encryption key', async () => {
    jest.spyOn(cipher, 'decrypt').mockReturnValue(null);

    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post(`/secrets/${defaultSecret.uuid}/decode`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ key: 'wrongkey' });

    expect(response.status).toBe(401);
  });
});
