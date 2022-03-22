import mongoose from 'mongoose';
import pino from 'pino';

import { DB_PASS, DB_URI, DB_USER } from './bootstrap';

const logger = pino();

mongoose
  .connect(DB_URI, {
    user: DB_USER,
    pass: DB_PASS,
    dbName: 'bedrockapi',
  })
  .then(() => logger.info('Connected to DB!'))
  .catch((error) => logger.info('Error connecting DB', error));
