import pino from 'pino';

import '@config/database';
import '@config/bootstrap';

import app from './server';

const logger = pino();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => logger.info(`Server is running at http://localhost:${PORT}`));
