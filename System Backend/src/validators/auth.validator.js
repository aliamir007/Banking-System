import { ROLE_VALUES } from '../constants/roles.js';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const validateRegister = (body) => {
  const errors = [];
  const { name, email, password, phone } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email is required' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    errors.push({ field: 'phone', message: 'A valid phone number is required' });
  }

  // if (role && !ROLE_VALUES.includes(role)) {
  //   errors.push({ field: 'role', message: `Role must be one of: ${ROLE_VALUES.join(', ')}` });
  // }

  return errors;
};

export const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body;

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'A valid email is required' });
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
};