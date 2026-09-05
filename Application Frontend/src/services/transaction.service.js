import { api } from './api.js';

// POST /api/v1/transactions/transfer
// body: { senderAccount, receiverAccount, amount, description }
// -> { transaction } (201 completed, 202 flagged/blocked)
export const transferRequest = (payload) => api.post('/transactions/transfer', payload);

// GET /api/v1/transactions -> { transactions }
export const listTransactionsRequest = () =>
  api.get('/transactions').then((res) => res.data.transactions);

// GET /api/v1/transactions/:id -> { transaction }
export const getTransactionRequest = (id) =>
  api.get(`/transactions/${id}`).then((res) => res.data.transaction);
