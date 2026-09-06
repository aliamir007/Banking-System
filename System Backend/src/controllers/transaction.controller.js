import { transferMoney, listTransactionsForUser, getTransactionById } from '../services/transaction.service.js';
import { validateTransfer } from '../validators/transaction.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendValidationError } from '../utils/apiResponse.js';

export const transfer = asyncHandler(async (req, res) => {
  const errors = validateTransfer(req.body);
  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  const { senderAccount, receiverAccount, amount, description } = req.body;

  const result = await transferMoney({
    senderUserId: req.user.id,
    senderAccountNumber: senderAccount,
    receiverAccountNumber: receiverAccount,
    amount,
    description,
  });

  if (result.blocked) {
    return sendSuccess(res, {
      statusCode: 202,
      message: 'This transaction was blocked by our fraud protection system and has been submitted for review',
      data: { transaction: result.transaction },
    });
  }

  const isFlagged = result.transaction.status === 'FLAGGED';

  return sendSuccess(res, {
    statusCode: isFlagged ? 202 : 201,
    message: isFlagged
      ? 'Transaction completed but flagged for review'
      : 'Transfer completed successfully',
    data: { transaction: result.transaction },
  });
});

export const list = asyncHandler(async (req, res) => {
  const transactions = await listTransactionsForUser(req.user.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Transactions retrieved successfully',
    data: { transactions },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const transaction = await getTransactionById(req.params.id, req.user);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Transaction retrieved successfully',
    data: { transaction },
  });
});