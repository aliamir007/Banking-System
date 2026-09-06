import { AppError } from '../utils/appError.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required before authorization', 401, 'NO_AUTH_CONTEXT');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403,
        'FORBIDDEN'
      );
    }

    next();
  };
};