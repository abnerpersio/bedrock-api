import { ErrorRequestHandler } from 'express';

import { RequestError } from '../errors/request-error';

export const ErrorHandler: ErrorRequestHandler = (error: Error, _req, res, _next) => {
  const { statusCode = 500 } = error as RequestError;

  res.status(statusCode).json({
    success: false,
    message: error.message,
  });
};
