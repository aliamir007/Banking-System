import { api } from './api.js';

// POST /api/v1/accounts -> { account }
export const createAccountRequest = (payload) =>
  api.post('/accounts', payload).then((res) => res.data.account);

// GET /api/v1/accounts -> { accounts }  (admins get every account, customers get their own)
export const listAccountsRequest = () => api.get('/accounts').then((res) => res.data.accounts);

// GET /api/v1/accounts/:id -> { account }
export const getAccountRequest = (id) => api.get(`/accounts/${id}`).then((res) => res.data.account);

// GET /api/v1/accounts/:id/balance -> { accountId, accountNumber, balance, currency, status }
export const getAccountBalanceRequest = (id) => api.get(`/accounts/${id}/balance`).then((res) => res.data);

// POST /api/v1/accounts/:id/deposit  body:{ amount } -> { account }
export const depositRequest = (id, amount) =>
  api.post(`/accounts/${id}/deposit`, { amount }).then((res) => res.data.account);