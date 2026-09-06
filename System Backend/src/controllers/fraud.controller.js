import { listFraudAlerts, getFraudAlertById, reviewFraudAlert } from '../services/fraud.service.js';
import { validateReviewAlert } from '../validators/fraud.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendValidationError } from '../utils/apiResponse.js';

export const list = asyncHandler(async (req, res) => {
  const alerts = await listFraudAlerts();

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Fraud alerts retrieved successfully',
    data: { alerts },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const alert = await getFraudAlertById(req.params.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Fraud alert retrieved successfully',
    data: { alert },
  });
});

export const review = asyncHandler(async (req, res) => {
  const errors = validateReviewAlert(req.body);
  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  const alert = await reviewFraudAlert(req.params.id, {
    status: req.body.status,
    reviewerId: req.user.id,
    requestMeta: { ip: req.ip, userAgent: req.headers['user-agent'] },
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Fraud alert updated successfully',
    data: { alert },
  });
});