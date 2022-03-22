import 'express-async-errors';
import express from 'express';
import '@config/bootstrap';
import './app/models';

import HeadersRemoverMiddleware from '@shared/middlewares/headers-remover';
import RateLimiterMiddlware from '@shared/middlewares/rate-limiter';
import ErrorHandler from '@shared/utils/error-handler';

import routes from './routes';

const app = express();

app.use(express.json());

app.use(RateLimiterMiddlware);
app.use(HeadersRemoverMiddleware);
app.use(routes);
app.use(ErrorHandler);

export default app;
