import request from 'supertest';

import { defaultSafe } from '@test-utils/fixtures/safe';
import { defaultUser } from '@test-utils/fixtures/user';
import { mockSafeModel } from '@test-utils/models/safe';
import { mockUserModel } from '@test-utils/models/user';

import { server } from '../../../server';
import { Safe } from '../../models';

describe('SafeController', () => {
  beforeEach(() => {
    mockUserModel();
    mockSafeModel();
  });

  async function mockAuthTokenRequest() {
    return request(server).post('/login').set('Content-Type', 'application/json').send({
      email: defaultUser.email,
      password: defaultUser.password,
    });
  }

  it('should create a safe successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/safes')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: defaultSafe.name,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(defaultSafe.name);
  });

  it('should get all safes successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server).get('/safes').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe(defaultSafe.name);
  });

  it('should not get all safes 404', async () => {
    Safe.find = jest.fn().mockResolvedValue([]);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server).get('/safes').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should get a safe searching by name', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/safes/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: defaultSafe.name });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.name);
  });

  it('should get a safe searching by id', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/safes/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: defaultSafe._id });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.name);
  });

  it('should get a safe searching by uuid', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/safes/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ uuid: defaultSafe.uuid });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.name);
  });

  it('should return 404 with invalid safe name', async () => {
    Safe.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .post('/safes/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'invalidname' });

    expect(response.status).toBe(404);
  });

  it('should update a safe successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .put(`/safes/${defaultSafe.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: defaultSafe.updatedName,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.updatedName);
  });

  it('should not update a safe 404', async () => {
    Safe.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .put(`/safes/${defaultSafe.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'invalidname',
      });

    expect(response.status).toBe(404);
  });

  it('should delete a safe successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .delete(`/safes/${defaultSafe.uuid}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  it('should not delete a safe 404', async () => {
    Safe.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(server)
      .delete(`/safes/${defaultSafe.uuid}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
