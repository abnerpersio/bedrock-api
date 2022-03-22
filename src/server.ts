import express from 'express';
import 'express-async-errors';

import '@config/bootstrap';
import HeadersRemoverMiddleware from '@shared/middlewares/headers-remover';
import RateLimiterMiddlware from '@shared/middlewares/rate-limiter';
import ErrorHandler from '@shared/utils/error-handler';

import './app/models';
import routes from './routes';

const app = express();

app.use(express.json());

app.use(RateLimiterMiddlware);
app.use(HeadersRemoverMiddleware);
app.use(routes);
app.use(ErrorHandler);

export default app;
