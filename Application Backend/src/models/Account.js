import mongoose from 'mongoose';
import { ACCOUNT_TYPE_VALUES, ACCOUNT_STATUS_VALUES, ACCOUNT_STATUS } from '../constants/accountStatus.js';

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountType: {
      type: String,
      enum: ACCOUNT_TYPE_VALUES,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    currency: {
      type: String,
      default: 'PKR',
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ACCOUNT_STATUS_VALUES,
      default: ACCOUNT_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

accountSchema.index({ accountNumber: 1 }, { unique: true });
accountSchema.index({ userId: 1 });

export const Account = mongoose.model('Account', accountSchema);