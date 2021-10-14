import { ErrorRequestHandler } from 'express';

const ErrorHandler: ErrorRequestHandler = (error: Error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: error.message,
  });
};

export default ErrorHandler;
