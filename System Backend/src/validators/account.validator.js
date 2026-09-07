import { ACCOUNT_TYPE_VALUES } from '../constants/accountStatus.js';

export const validateCreateAccount = (body) => {
  const errors = [];
  const { accountType, currency } = body;

  if (!accountType || !ACCOUNT_TYPE_VALUES.includes(accountType)) {
    errors.push({
      field: 'accountType',
      message: `accountType must be one of: ${ACCOUNT_TYPE_VALUES.join(', ')}`,
    });
  }

  if (currency && (typeof currency !== 'string' || currency.trim().length !== 3)) {
    errors.push({ field: 'currency', message: 'currency must be a 3-letter code, e.g. PKR' });
  }

  return errors;
};

export const validateDeposit = (body) => {
  const errors = [];
  const { amount } = body;
  const numericAmount = Number(amount);

  if (amount === undefined || amount === null || amount === '' || Number.isNaN(numericAmount)) {
    errors.push({ field: 'amount', message: 'amount must be a number' });
  } else if (numericAmount <= 0) {
    errors.push({ field: 'amount', message: 'amount must be greater than 0' });
  } else if (numericAmount > 10000000) {
    errors.push({ field: 'amount', message: 'amount exceeds the maximum allowed deposit' });
  }

  return errors;
};