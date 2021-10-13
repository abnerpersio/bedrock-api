import express from 'express';
import './config/bootstrap';
import './config/database';

import HeadersRemoverMiddleware from './middlewares/headers-remover';
import RateLimiterMiddlware from './middlewares/rate-limiter';

import routes from './routes';

const app = express();

app.use(RateLimiterMiddlware);
app.use(HeadersRemoverMiddleware);
app.use(routes);

app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
