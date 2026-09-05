import { Account } from '../models/Account.js';
import { AppError } from '../utils/appError.js';
import { ROLES } from '../constants/roles.js';
import crypto from 'node:crypto';
import { createAuditLog } from './audit.service.js';

const generateAccountNumber = async () => {
  let accountNumber;
  let exists = true;

  while (exists) {
    // 10-digit numeric account number, e.g. "4821093756"
    accountNumber = crypto.randomInt(1000000000, 9999999999).toString();
    exists = await Account.exists({ accountNumber });
  }

  return accountNumber;
};

export const createAccount = async ({ userId, accountType, currency }, requestMeta = {}) => {
  const accountNumber = await generateAccountNumber();

  const account = await Account.create({
    accountNumber,
    userId,
    accountType,
    currency: currency ? currency.toUpperCase() : 'PKR',
  });

  await createAuditLog({
    userId,
    action: 'ACCOUNT_CREATED',
    resource: 'Account',
    resourceId: account._id,
    metadata: { accountNumber: account.accountNumber, accountType: account.accountType },
    ipAddress: requestMeta.ip,
    userAgent: requestMeta.userAgent,
  });

  return account;
};

export const listAccountsForUser = async (userId) => {
  return Account.find({ userId }).sort({ createdAt: -1 });
};

export const listAllAccounts = async () => {
  return Account.find().sort({ createdAt: -1 });
};

const assertOwnershipOrAdmin = (account, requester) => {
  const isOwner = account.userId.toString() === requester.id;
  const isAdmin = requester.role === ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new AppError('You do not have access to this account', 403, 'FORBIDDEN');
  }
};

export const getAccountById = async (accountId, requester) => {
  const account = await Account.findById(accountId);

  if (!account) {
    throw new AppError('Account not found', 404, 'ACCOUNT_NOT_FOUND');
  }

  assertOwnershipOrAdmin(account, requester);

  return account;
};

export const getAccountBalance = async (accountId, requester) => {
  const account = await getAccountById(accountId, requester);

  return {
    accountId: account._id,
    accountNumber: account.accountNumber,
    balance: account.balance,
    currency: account.currency,
    status: account.status,
  };
};