import mongoose from 'mongoose';
import { FRAUD_ALERT_STATUS, FRAUD_ALERT_STATUS_VALUES } from '../constants/fraudSeverity.js';

const fraudAlertSchema = new mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    rulesTriggered: {
      type: [String],
      default: [],
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
    },
    severity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: FRAUD_ALERT_STATUS_VALUES,
      default: FRAUD_ALERT_STATUS.OPEN,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Fast lookup of alerts for a given transaction or account
fraudAlertSchema.index({ transactionId: 1 });
fraudAlertSchema.index({ accountId: 1 });
// Admins filtering the review queue by status/severity
fraudAlertSchema.index({ status: 1 });
fraudAlertSchema.index({ severity: 1 });

export const FraudAlert = mongoose.model('FraudAlert', fraudAlertSchema);