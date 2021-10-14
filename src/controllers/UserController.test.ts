import request from 'supertest';
import { cleanDatabaseAndClose, connectDatabase } from '../test/utils/database';

import app from '../server';
import { DefaultUser } from '../test/fixtures/user';

describe('User Controller', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await cleanDatabaseAndClose();
  });

  async function mockDefaultUser() {
    return request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: DefaultUser.email,
        password: DefaultUser.password,
      });
  }

  async function mockAuthToken() {
    return request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: DefaultUser.email,
        password: DefaultUser.password,
      });
  }

  test('It should create user', async () => {
    const response = await mockDefaultUser();

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(DefaultUser.email);
  });

  test('It should not allow create user with existing email', async () => {
    await mockDefaultUser();

    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: DefaultUser.email,
        password: DefaultUser.password,
      });

    expect(response.status).toBe(400);
  });

  test('It should login correctly', async () => {
    await mockDefaultUser();

    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: DefaultUser.email,
        password: DefaultUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.token).not.toBeFalsy();
  });

  test('It should not login with invalid payload', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: DefaultUser.email,
      });

    expect(response.status).toBe(400);
  });

  test('It should return logged user data', async () => {
    await mockDefaultUser();
    const { token } = (await mockAuthToken()).body.data;

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe(DefaultUser.email);
  });

  test('It should delete user', async () => {
    await mockDefaultUser();
    const { token } = (await mockAuthToken()).body.data;

    const response = await request(app)
      .delete('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
