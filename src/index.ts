import pino from 'pino';

import '@config/bootstrap';
import '@config/database';

import app from './server';

const logger = pino();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => logger.info(`Server is running at http://localhost:${PORT}`));
