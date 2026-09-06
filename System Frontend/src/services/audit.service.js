import { api } from './api.js';

// GET /api/v1/audit-logs -> { logs }  (admin only)
export const listAuditLogsRequest = () => api.get('/audit-logs').then((res) => res.data.logs);

// GET /api/v1/audit-logs/:id -> { log }  (admin only)
export const getAuditLogRequest = (id) => api.get(`/audit-logs/${id}`).then((res) => res.data.log);
