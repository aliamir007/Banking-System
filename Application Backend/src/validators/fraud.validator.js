import { FRAUD_ALERT_STATUS_VALUES, FRAUD_ALERT_STATUS } from '../constants/fraudSeverity.js';

// Admins can move an alert to UNDER_REVIEW, RESOLVED, or FALSE_POSITIVE.
// OPEN is the initial system-assigned state, not something to set manually.
const REVIEWABLE_STATUSES = FRAUD_ALERT_STATUS_VALUES.filter((s) => s !== FRAUD_ALERT_STATUS.OPEN);

export const validateReviewAlert = (body) => {
  const errors = [];
  const { status } = body;

  if (!status || !REVIEWABLE_STATUSES.includes(status)) {
    errors.push({
      field: 'status',
      message: `status must be one of: ${REVIEWABLE_STATUSES.join(', ')}`,
    });
  }

  return errors;
};