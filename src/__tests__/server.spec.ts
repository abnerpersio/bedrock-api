import request from 'supertest';

import app from '../server';

test('Verify if the server is working', async () => {
  const response = await request(app).get('/ping');

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.message).toBe('Everything is ok here');
});
