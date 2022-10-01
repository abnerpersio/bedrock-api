import express from 'express';
import 'express-async-errors';

import '@config/bootstrap';
import { ErrorHandler } from '@shared/middlewares/error-handler';
import { HeadersRemoverMiddleware } from '@shared/middlewares/headers-remover';
import { RateLimiterMiddlware } from '@shared/middlewares/rate-limiter';

import './app/models';
import { routes } from './routes';

export const server = express();

server.use(express.json());

server.use(RateLimiterMiddlware);
server.use(HeadersRemoverMiddleware);
server.use(routes);
server.use(ErrorHandler);
