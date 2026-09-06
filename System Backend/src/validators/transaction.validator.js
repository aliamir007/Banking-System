export const validateTransfer = (body) => {
  const errors = [];
  const { senderAccount, receiverAccount, amount, description } = body;

  if (!senderAccount || typeof senderAccount !== 'string' || senderAccount.trim().length === 0) {
    errors.push({ field: 'senderAccount', message: 'senderAccount (account number) is required' });
  }

  if (!receiverAccount || typeof receiverAccount !== 'string' || receiverAccount.trim().length === 0) {
    errors.push({ field: 'receiverAccount', message: 'receiverAccount (account number) is required' });
  }

  if (senderAccount && receiverAccount && senderAccount === receiverAccount) {
    errors.push({ field: 'receiverAccount', message: 'Sender and receiver accounts must be different' });
  }

  if (amount === undefined || amount === null || typeof amount !== 'number' || Number.isNaN(amount)) {
    errors.push({ field: 'amount', message: 'amount must be a number' });
  } else if (amount <= 0) {
    errors.push({ field: 'amount', message: 'amount must be greater than zero' });
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push({ field: 'description', message: 'description must be a string' });
  }

  return errors;
};