import request from 'supertest';

import { server } from '../server';

it('should verify if the server is working', async () => {
  const response = await request(server).get('/ping');

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.message).toBe('Everything is ok here');
});
