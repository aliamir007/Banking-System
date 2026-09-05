import {
  createAccount,
  listAccountsForUser,
  listAllAccounts,
  getAccountById,
  getAccountBalance,
} from '../services/account.service.js';
import { validateCreateAccount } from '../validators/account.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendValidationError } from '../utils/apiResponse.js';
import { ROLES } from '../constants/roles.js';

export const create = asyncHandler(async (req, res) => {
  const errors = validateCreateAccount(req.body);
  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  const account = await createAccount(
    { userId: req.user.id, accountType: req.body.accountType, currency: req.body.currency },
    { ip: req.ip, userAgent: req.headers['user-agent'] }
  );

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Account created successfully',
    data: { account },
  });
});

// changes later on

export const list = asyncHandler(async (req, res) => {
  // Admins listing via this endpoint still only see their own accounts;
  // admin-wide visibility lives under /api/v1/admin/accounts (later stage)
  const accounts = req.user.role === ROLES.ADMIN
    ? await listAllAccounts()
    : await listAccountsForUser(req.user.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Accounts retrieved successfully',
    data: { accounts },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const account = await getAccountById(req.params.id, req.user);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Account retrieved successfully',
    data: { account },
  });
});

export const getBalance = asyncHandler(async (req, res) => {
  const balance = await getAccountBalance(req.params.id, req.user);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Balance retrieved successfully',
    data: balance,
  });
});