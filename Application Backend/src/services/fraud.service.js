import { FraudAlert } from '../models/FraudAlert.js';
import { AppError } from '../utils/appError.js';
import { createAuditLog } from './audit.service.js';

export const listFraudAlerts = async () => {
  return FraudAlert.find()
    .sort({ createdAt: -1 })
    .populate('transactionId')
    .populate('accountId', 'accountNumber accountType userId');
};

export const getFraudAlertById = async (alertId) => {
  const alert = await FraudAlert.findById(alertId)
    .populate('transactionId')
    .populate('accountId', 'accountNumber accountType userId');

  if (!alert) {
    throw new AppError('Fraud alert not found', 404, 'FRAUD_ALERT_NOT_FOUND');
  }

  return alert;
};

export const reviewFraudAlert = async (alertId, { status, reviewerId, requestMeta = {} }) => {
  const alert = await FraudAlert.findById(alertId);

  if (!alert) {
    throw new AppError('Fraud alert not found', 404, 'FRAUD_ALERT_NOT_FOUND');
  }

  alert.status = status;
  alert.reviewedBy = reviewerId;
  alert.reviewedAt = new Date();
  await alert.save();

  await createAuditLog({
    userId: reviewerId,
    action: 'FRAUD_ALERT_REVIEWED',
    resource: 'FraudAlert',
    resourceId: alert._id,
    metadata: { newStatus: status, transactionId: alert.transactionId },
    ipAddress: requestMeta.ip,
    userAgent: requestMeta.userAgent,
  });

  return alert;
};