import { registerUser, loginUser, getUserById } from '../services/auth.service.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendValidationError } from '../utils/apiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const errors = validateRegister(req.body);
  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  const result = await registerUser(req.body,{
    ip:req.ip,
    userAgent: req.headers['user-Agent'],
  })

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Registration successful',
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const errors = validateLogin(req.body);
  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  const result = await loginUser(req.body,{
    ip:req.ip,
    userAgent: req.headers['user-Agent']
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Login successful',
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Current user retrieved',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    },
  });
});