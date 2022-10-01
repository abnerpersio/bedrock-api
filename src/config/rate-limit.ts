import { LIMIT_REQUESTS_BY_SECOND } from './bootstrap';

export const rateLimitOptions = {
  windowMs: 60 * 1000,
  max: parseInt(LIMIT_REQUESTS_BY_SECOND, 10) || 5,
  message: 'Too many requests, please try again later.',
};
