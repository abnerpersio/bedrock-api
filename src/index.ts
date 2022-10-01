import '@config/bootstrap';
import '@config/database';
import { logger } from '@config/logger';

import { server } from './server';

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => logger.info(`Server is running at http://localhost:${PORT}`));
