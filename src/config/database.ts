import mongoose from 'mongoose';

import { DB_PASS, DB_URI, DB_USER } from '@config/bootstrap';
import { logger } from '@config/logger';

mongoose
  .connect(DB_URI, {
    user: DB_USER,
    pass: DB_PASS,
    dbName: 'bedrockapi',
  })
  .then(() => logger.info('Connected to DB!'))
  .catch((error) => logger.info('Error connecting DB', error));
