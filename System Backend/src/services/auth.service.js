import { User } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/generateToken.js';
import { AppError } from '../utils/appError.js';
import { ROLES } from '../constants/roles.js';
import { createAuditLog } from './audit.service.js';

export const registerUser = async ({ name, email, password, phone },requestMeta={}) => {
  
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409, 'EMAIL_ALREADY_EXISTS');
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    role: ROLES.CUSTOMER, 
  });

  await createAuditLog({

    userId: user._id,
    action: 'USER_REGISTERED',
    resource: 'User',
    resourceId: user._id,
    metadata: { email: user.email },
    ipAddress: requestMeta.ip,
    userAgent: requestMeta.userAgent,
  });

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async ({ email, password },requestMeta = {}) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated', 403, 'ACCOUNT_INACTIVE');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  await createAuditLog({
    userId: user._id,
    action: 'USER_LOGIN',
    resource: 'User',
    resourceId: user._id,
    metadata: { email: user.email },
    ipAddress: requestMeta.ip,
    userAgent: requestMeta.userAgent,
  });

  const token = generateToken(user._id, user.role);
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  return user;
};