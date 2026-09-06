import { Transaction } from '../models/Transaction.js';

export const checkRapidTransactions = async ({ senderAccountId }) => {
  const FRAUD_RAPID_TRANSACTION_WINDOW = Number(process.env.FRAUD_RAPID_TRANSACTION_WINDOW);
  const FRAUD_RAPID_TRANSACTION_COUNT = Number(process.env.FRAUD_RAPID_TRANSACTION_COUNT);

  const windowStart = new Date(Date.now() - FRAUD_RAPID_TRANSACTION_WINDOW * 60 * 1000);

  const recentCount = await Transaction.countDocuments({
    senderAccount: senderAccountId,
    createdAt: { $gte: windowStart },
  });

  const triggered = [];
  let points = 0;

  if (recentCount >= FRAUD_RAPID_TRANSACTION_COUNT) {
    triggered.push('RAPID_TRANSACTIONS');
    points += 30;
  }

  return { triggered, points };
};