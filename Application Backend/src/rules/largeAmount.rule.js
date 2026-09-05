import { env } from '../config/env.js';

export const checkLargeAmount = ({ amount }) => {
  const triggered = [];
  let points = 0;

  if (amount > env.FRAUD_CRITICAL_AMOUNT) {
    triggered.push('VERY_LARGE_AMOUNT');
    points += 50;
  } else if (amount > env.FRAUD_LARGE_AMOUNT) {
    triggered.push('LARGE_AMOUNT');
    points += 40;
  }

  return { triggered, points };
};