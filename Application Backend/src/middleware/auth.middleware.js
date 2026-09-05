import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication token missing', 401, 'NO_TOKEN');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, jwtConfig.secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED');
    }
    throw new AppError('Invalid authentication token', 401, 'INVALID_TOKEN');
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('User belonging to this token no longer exists', 401, 'USER_NOT_FOUND');
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated', 403, 'ACCOUNT_INACTIVE');
  }

  req.user = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  next();
});