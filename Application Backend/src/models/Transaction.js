import mongoose from 'mongoose';
import crypto from 'node:crypto';
import {
  TRANSACTION_TYPE_VALUES,
  TRANSACTION_STATUS_VALUES,
  TRANSACTION_STATUS,
} from '../constants/transactionStatus.js';

const transactionSchema = new mongoose.Schema(
  {
    senderAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    receiverAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPE_VALUES,
      default: 'TRANSFER',
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUS_VALUES,
      default: TRANSACTION_STATUS.PENDING,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    fraudFlagged: {
      type: Boolean,
      default: false,
    },
    fraudScore: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ senderAccount: 1 });
transactionSchema.index({ receiverAccount: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ status: 1 });

export const generateTransactionReference = () => {
  // e.g. "TXN-1B2C3D4E5F6A7B8C"
  return `TXN-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
};

export const Transaction = mongoose.model('Transaction', transactionSchema);