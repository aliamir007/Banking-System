import mongoose from 'mongoose';
import { Account } from '../models/Account.js';
import { Transaction, generateTransactionReference } from '../models/Transaction.js';
import { AppError } from '../utils/appError.js';
import { ACCOUNT_STATUS } from '../constants/accountStatus.js';
import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '../constants/transactionStatus.js';
import { ROLES } from '../constants/roles.js';
import { runRuleEngine } from '../rules/ruleEngine.js';
import { FraudAlert } from '../models/FraudAlert.js';
import { FRAUD_ALERT_STATUS } from '../constants/fraudSeverity.js';
import { createAuditLog } from './audit.service.js';

export const transferMoney = async ({ senderUserId, senderAccountNumber, receiverAccountNumber, amount, description }) => {
  // ---- Step 1-7: Pre-transaction validation (outside the DB transaction) ----

  const senderAccount = await Account.findOne({ accountNumber: senderAccountNumber });
  if (!senderAccount) {
    throw new AppError('Sender account not found', 404, 'SENDER_ACCOUNT_NOT_FOUND');
  }

  if (senderAccount.userId.toString() !== senderUserId) {
    throw new AppError('You do not own the sender account', 403, 'FORBIDDEN');
  }

  if (senderAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    throw new AppError(`Sender account is ${senderAccount.status}`, 422, 'SENDER_ACCOUNT_NOT_ACTIVE');
  }

  const receiverAccount = await Account.findOne({ accountNumber: receiverAccountNumber });
  if (!receiverAccount) {
    throw new AppError('Receiver account not found', 404, 'RECEIVER_ACCOUNT_NOT_FOUND');
  }

  if (receiverAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    throw new AppError(`Receiver account is ${receiverAccount.status}`, 422, 'RECEIVER_ACCOUNT_NOT_ACTIVE');
  }

  if (senderAccount._id.toString() === receiverAccount._id.toString()) {
    throw new AppError('Cannot transfer to the same account', 422, 'SAME_ACCOUNT_TRANSFER');
  }

  if (senderAccount.balance < amount) {
    throw new AppError('Insufficient account balance', 422, 'INSUFFICIENT_BALANCE');
  }

  const fraudResult = await runRuleEngine({ senderAccount, receiverAccount, amount });

  const session = await mongoose.startSession();

  try {
    let transactionRecord;
    let alertRecord = null;

    await session.withTransaction(async () => {
      if (fraudResult.shouldBlock) {
        // CRITICAL: create the transaction record as FLAGGED with NO balance
        // changes, then create a fraud alert referencing it, then stop —
        // no money moves, but the attempt is fully recorded for review.
        const [created] = await Transaction.create(
          [
            {
              senderAccount: senderAccount._id,
              receiverAccount: receiverAccount._id,
              amount,
              type: TRANSACTION_TYPES.TRANSFER,
              status: TRANSACTION_STATUS.FLAGGED,
              reference: generateTransactionReference(),
              description: description || '',
              fraudFlagged: true,
              fraudScore: fraudResult.riskScore,
            },
          ],
          { session }
        );

        transactionRecord = created;

        const [alert] = await FraudAlert.create(
          [
            {
              transactionId: created._id,
              accountId: senderAccount._id,
              rulesTriggered: fraudResult.rulesTriggered,
              riskScore: fraudResult.riskScore,
              severity: fraudResult.severity,
              status: FRAUD_ALERT_STATUS.OPEN,
            },
          ],
          { session }
        );

        alertRecord = alert;

        await createAuditLog({
          userId: senderUserId,
          action: 'TRANSFER_FLAGGED',
          resource: 'Transaction',
          resourceId: created._id,
          metadata: { amount, senderAccountNumber, receiverAccountNumber, blocked: true },
          session,
        });

        return; // stop here — no balance mutation for a blocked transfer
      }

      // Not blocked: proceed with the actual money movement.
      // Same conditional-update concurrency strategy as before —
      // findOneAndUpdate with balance >= amount prevents concurrent overdraw.
      const updatedSender = await Account.findOneAndUpdate(
        { _id: senderAccount._id, status: ACCOUNT_STATUS.ACTIVE, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { session, new: true }
      );

      if (!updatedSender) {
        throw new AppError(
          'Insufficient balance or account state changed — transfer aborted',
          409,
          'TRANSFER_CONFLICT'
        );
      }

      const updatedReceiver = await Account.findOneAndUpdate(
        { _id: receiverAccount._id, status: ACCOUNT_STATUS.ACTIVE },
        { $inc: { balance: amount } },
        { session, new: true }
      );

      if (!updatedReceiver) {
        throw new AppError(
          'Receiver account state changed during transfer — transfer aborted',
          409,
          'TRANSFER_CONFLICT'
        );
      }

      // HIGH severity: money still moves, but flagged for admin review + alert created.
      // MEDIUM: money moves, flagged on the transaction record, no admin alert.
      // LOW: money moves, nothing flagged.
      const isHigh = fraudResult.severity === 'HIGH';
      const status = isHigh ? TRANSACTION_STATUS.FLAGGED : TRANSACTION_STATUS.COMPLETED;

      const [created] = await Transaction.create(
        [
          {
            senderAccount: senderAccount._id,
            receiverAccount: receiverAccount._id,
            amount,
            type: TRANSACTION_TYPES.TRANSFER,
            status,
            reference: generateTransactionReference(),
            description: description || '',
            fraudFlagged: fraudResult.rulesTriggered.length > 0,
            fraudScore: fraudResult.riskScore,
          },
        ],
        { session }
      );

      transactionRecord = created;

      if (isHigh) {
        const [alert] = await FraudAlert.create(
          [
            {
              transactionId: created._id,
              accountId: senderAccount._id,
              rulesTriggered: fraudResult.rulesTriggered,
              riskScore: fraudResult.riskScore,
              severity: fraudResult.severity,
              status: FRAUD_ALERT_STATUS.OPEN,
            },
          ],
          { session }
        );
        alertRecord = alert;
      }

      await createAuditLog({
        userId: senderUserId,
        action: isHigh ? 'TRANSFER_FLAGGED' : 'TRANSFER_COMPLETED',
        resource: 'Transaction',
        resourceId: created._id,
        metadata: { amount, senderAccountNumber, receiverAccountNumber },
        session,
      });
    });

    return { transaction: transactionRecord, alert: alertRecord, blocked: fraudResult.shouldBlock };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Transfer failed due to an internal error', 500, 'TRANSFER_FAILED');
  } finally {
    await session.endSession();
  }
};

export const listTransactionsForUser = async (userId) => {
  const accounts = await Account.find({ userId }).select('_id');
  const accountIds = accounts.map((a) => a._id);

  return Transaction.find({
    $or: [{ senderAccount: { $in: accountIds } }, { receiverAccount: { $in: accountIds } }],
  })
    .sort({ createdAt: -1 })
    .populate('senderAccount', 'accountNumber accountType')
    .populate('receiverAccount', 'accountNumber accountType');
};

export const getTransactionById = async (transactionId, requester) => {
  const transaction = await Transaction.findById(transactionId)
    .populate('senderAccount', 'accountNumber accountType userId')
    .populate('receiverAccount', 'accountNumber accountType userId');

  if (!transaction) {
    throw new AppError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
  }

  const isParticipant =
    transaction.senderAccount.userId.toString() === requester.id ||
    transaction.receiverAccount.userId.toString() === requester.id;
  const isAdmin = requester.role === ROLES.ADMIN;

  if (!isParticipant && !isAdmin) {
    throw new AppError('You do not have access to this transaction', 403, 'FORBIDDEN');
  }

  return transaction;
};