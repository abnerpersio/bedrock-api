import request from 'supertest';
import { cleanDatabaseAndClose, cleanDatabaseCollections, connectDatabase } from '../test/utils/database';

import app from '../server';

describe('User Controller', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterEach(async () => {
    await cleanDatabaseCollections();
  });

  afterAll(async () => {
    await cleanDatabaseAndClose();
  });

  test('It should create user', async () => {
    const response = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        email: 'binhopersio@gmail.com',
        password: 'pass',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.email).toBe('binhopersio@gmail.com');
  });
});
