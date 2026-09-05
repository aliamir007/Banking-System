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