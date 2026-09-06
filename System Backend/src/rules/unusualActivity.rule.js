import { Transaction } from '../models/Transaction.js';
import { TRANSACTION_STATUS } from '../constants/transactionStatus.js';

const UNUSUAL_MULTIPLIER = 3;
const MIN_HISTORY_FOR_BASELINE = 3;

export const checkUnusualActivity = async ({ senderAccountId, amount }) => {
  const triggered = [];
  let points = 0;

  const stats = await Transaction.aggregate([
    {
      $match: {
        senderAccount: senderAccountId,
        status: TRANSACTION_STATUS.COMPLETED,
      },
    },
    {
      $group: {
        _id: null,
        avgAmount: { $avg: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const history = stats[0];

  if (!history || history.count < MIN_HISTORY_FOR_BASELINE) {
    return { triggered, points };
  }

  if (amount > history.avgAmount * UNUSUAL_MULTIPLIER) {
    triggered.push('UNUSUAL_ACTIVITY');
    points += 25;
  }

  return { triggered, points };
};