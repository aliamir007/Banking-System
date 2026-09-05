import { Transaction } from '../models/Transaction.js';
import { env } from '../config/env.js';

export const checkRapidTransactions = async ({ senderAccountId }) => {
  const windowStart = new Date(Date.now() - env.FRAUD_RAPID_TRANSACTION_WINDOW * 60 * 1000);

  const recentCount = await Transaction.countDocuments({
    senderAccount: senderAccountId,
    createdAt: { $gte: windowStart },
  });

  const triggered = [];
  let points = 0;

  if (recentCount >= env.FRAUD_RAPID_TRANSACTION_COUNT) {
    triggered.push('RAPID_TRANSACTIONS');
    points += 30;
  }

  return { triggered, points };
};