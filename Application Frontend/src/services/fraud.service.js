import { api } from './api.js';

// GET /api/v1/fraud/alerts -> { alerts }  (admin only)
export const listFraudAlertsRequest = () => api.get('/fraud/alerts').then((res) => res.data.alerts);

// GET /api/v1/fraud/alerts/:id -> { alert }  (admin only)
export const getFraudAlertRequest = (id) => api.get(`/fraud/alerts/${id}`).then((res) => res.data.alert);

// PATCH /api/v1/fraud/alerts/:id/review  body:{ status } -> { alert }  (admin only)
// status must be one of UNDER_REVIEW | RESOLVED | FALSE_POSITIVE
export const reviewFraudAlertRequest = (id, status) =>
  api.patch(`/fraud/alerts/${id}/review`, { status }).then((res) => res.data.alert);
