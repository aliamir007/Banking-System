import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400, 'INVALID_ID');
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new AppError(`Duplicate value for ${field}`, 409, 'DUPLICATE_KEY');
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token', 401, 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED');
  }

  const isKnownError = error instanceof AppError;
  const statusCode = isKnownError ? error.statusCode : 500;
  const code = isKnownError ? error.code : 'INTERNAL_SERVER_ERROR';
  const message = isKnownError ? error.message : 'Something went wrong on our end';

  if (!isKnownError) {
    console.error('UNEXPECTED ERROR:', err);
  }

  const payload = {
    success: false,
    message,
    error: { code },
  };

  if (env.NODE_ENV === 'development') {
    payload.error.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
};