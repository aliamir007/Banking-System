import axios from 'axios';
import { getToken, clearSession } from '../utils/storage.js';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The backend always responds with { success, message, data } on success, or
// { success:false, message, error:{code} } / { success:false, message, errors:[...] } on failure.
// Normalize both into a plain JS Error so calling code can just do try/catch.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const payload = error.response?.data;

    if (!payload) {
      return Promise.reject(new Error('Cannot reach the server. Please check your connection.'));
    }

    // 401s (except on the login/register calls themselves) mean the token is
    // dead — clear it so the app falls back to the login screen next render.
    if (error.response?.status === 401) {
      clearSession();
    }

    const message =
      payload.message ||
      (payload.errors && payload.errors[0]?.message) ||
      'Something went wrong. Please try again.';

    const normalized = new Error(message);
    normalized.code = payload.error?.code;
    normalized.fieldErrors = payload.errors || null;
    normalized.status = error.response?.status;

    return Promise.reject(normalized);
  }
);
