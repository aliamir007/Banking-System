import { checkLargeAmount } from './largeAmount.rule.js';
import { checkRapidTransactions } from './rapidTransactions.rule.js';
import { checkUnusualActivity } from './unusualActivity.rule.js';
import { checkAccountSafety } from './balance.rule.js';
import { FRAUD_SEVERITY, FRAUD_SEVERITY_THRESHOLDS } from '../constants/fraudSeverity.js';

const getSeverity = (riskScore) => {
  if (riskScore >= FRAUD_SEVERITY_THRESHOLDS.CRITICAL) return FRAUD_SEVERITY.CRITICAL;
  if (riskScore >= FRAUD_SEVERITY_THRESHOLDS.HIGH) return FRAUD_SEVERITY.HIGH;
  if (riskScore >= FRAUD_SEVERITY_THRESHOLDS.MEDIUM) return FRAUD_SEVERITY.MEDIUM;
  return FRAUD_SEVERITY.LOW;
};

export const runRuleEngine = async ({ senderAccount, receiverAccount, amount }) => {
  const safety = checkAccountSafety({ senderAccount, receiverAccount });

  if (safety.block) {
    return {
      riskScore: 100,
      severity: FRAUD_SEVERITY.CRITICAL,
      rulesTriggered: safety.triggered,
      shouldBlock: true,
    };
  }

  const [largeAmountResult, rapidResult, unusualResult] = await Promise.all([
    Promise.resolve(checkLargeAmount({ amount })),
    checkRapidTransactions({ senderAccountId: senderAccount._id }),
    checkUnusualActivity({ senderAccountId: senderAccount._id, amount }),
  ]);

  const rulesTriggered = [
    ...largeAmountResult.triggered,
    ...rapidResult.triggered,
    ...unusualResult.triggered,
  ];

  const riskScore = Math.min(
    100,
    largeAmountResult.points + rapidResult.points + unusualResult.points
  );

  const severity = getSeverity(riskScore);
  const shouldBlock = severity === FRAUD_SEVERITY.CRITICAL;

  return { riskScore, severity, rulesTriggered, shouldBlock };
};