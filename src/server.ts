import 'express-async-errors';
import express from 'express';
import './config/bootstrap';
import './models';

import HeadersRemoverMiddleware from './middlewares/headers-remover';
import RateLimiterMiddlware from './middlewares/rate-limiter';
import ErrorHandler from './utils/error-handler';

import routes from './routes';

const app = express();

app.use(express.json());

app.use(RateLimiterMiddlware);
app.use(HeadersRemoverMiddleware);
app.use(routes);
app.use(ErrorHandler);

export default app;
