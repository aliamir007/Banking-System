export const checkLargeAmount = ({ amount }) => {
  const triggered = [];
  let points = 0;

  const FRAUD_CRITICAL_AMOUNT = Number(process.env.FRAUD_CRITICAL_AMOUNT);
  const FRAUD_LARGE_AMOUNT = Number(process.env.FRAUD_LARGE_AMOUNT);

  if (amount > FRAUD_CRITICAL_AMOUNT) {
    triggered.push('VERY_LARGE_AMOUNT');
    points += 50;
  } else if (amount > FRAUD_LARGE_AMOUNT) {
    triggered.push('LARGE_AMOUNT');
    points += 40;
  }

  return { triggered, points };
};