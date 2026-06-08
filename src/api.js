import axios from 'axios';
import { getToken, clearAuth } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
});

// Attach the bearer token to every outgoing request when present.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is rejected (token revoked, account deactivated, etc.), drop
// the local session so the UI flips back to logged-out state. The component
// catching the error can still show its own message.
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      clearAuth();
    }
    return Promise.reject(err);
  },
);

export default api;
