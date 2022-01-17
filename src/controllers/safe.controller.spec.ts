import request from 'supertest';
import { Safe } from '../models';

import app from '../server';

import { defaultSafe } from '../test/fixtures/safe';
import { defaultUser } from '../test/fixtures/user';
import { mockUserModel } from './user.controller.spec';

export const mockSafeModel = () => {
  Safe.find = jest.fn().mockResolvedValue([new Safe(defaultSafe)]);
  Safe.findById = jest.fn().mockResolvedValue(new Safe(defaultSafe));
  Safe.findOne = jest.fn().mockResolvedValue(new Safe(defaultSafe));
  Safe.create = jest.fn().mockResolvedValue(new Safe(defaultSafe));
  Safe.findOneAndDelete = jest.fn().mockResolvedValue(true);
  Safe.findOneAndUpdate = jest
    .fn()
    .mockResolvedValue(new Safe({ ...defaultSafe, name: defaultSafe.updatedName }));
};

describe('Safe Controller', () => {
  beforeEach(() => {
    mockUserModel();
    mockSafeModel();
  });

  async function mockAuthTokenRequest() {
    return request(app).post('/login').set('Content-Type', 'application/json').send({
      email: defaultUser.email,
      password: defaultUser.password,
    });
  }

  test('It should create a safe successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .post('/safes')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: defaultSafe.name,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.name);
  });

  test('It should get all safes successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app).get('/safes').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data[0].name).toBe(defaultSafe.name);
  });

  test('It should not get all safes 404', async () => {
    Safe.find = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app).get('/safes').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('It should get a safe searching by name', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/safes/search')
      .query({ name: defaultSafe.name })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.name);
  });

  test('It should get a safe searching by id', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/safes/search')
      .query({ id: defaultSafe._id })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.name);
  });

  test('It should get a safe searching by uuid', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/safes/search')
      .query({ uuid: defaultSafe.uuid })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.name);
  });

  test('It should return 404 with invalid safe name', async () => {
    Safe.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .get('/safes/search')
      .query({ name: 'invalidname' })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('It should update a safe successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .put(`/safes/${defaultSafe.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: defaultSafe.updatedName,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe(defaultSafe.updatedName);
  });

  test('It should not update a safe 404', async () => {
    Safe.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .put(`/safes/${defaultSafe.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'invalidname',
      });

    expect(response.status).toBe(404);
  });

  test('It should delete a safe successfully', async () => {
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .delete(`/safes/${defaultSafe.uuid}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });

  test('It should not delete a safe 404', async () => {
    Safe.findOne = jest.fn().mockResolvedValue(null);
    const { token } = (await mockAuthTokenRequest()).body.data;

    const response = await request(app)
      .delete(`/safes/${defaultSafe.uuid}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
