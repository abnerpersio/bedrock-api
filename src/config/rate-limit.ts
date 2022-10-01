import { LIMIT_REQUESTS_BY_PERIOD, RATE_LIMIT_IN_SECONDS } from './bootstrap';

const limitInSeconds = parseInt(RATE_LIMIT_IN_SECONDS, 10) || 10;

export const rateLimitOptions = {
  windowMs: limitInSeconds * 1000,
  max: parseInt(LIMIT_REQUESTS_BY_PERIOD, 10) || 5,
  message: 'Too many requests, please try again later.',
};
