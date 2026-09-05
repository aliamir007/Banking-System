import { api } from './api.js';

// POST /api/v1/auth/register -> { token, user:{ id, name, email, role } }
export const registerRequest = (payload) => api.post('/auth/register', payload).then((res) => res.data);

// POST /api/v1/auth/login -> { token, user:{ id, name, email, role } }
export const loginRequest = (payload) => api.post('/auth/login', payload).then((res) => res.data);

// GET /api/v1/auth/me -> { user }
export const getMeRequest = () => api.get('/auth/me').then((res) => res.data.user);
