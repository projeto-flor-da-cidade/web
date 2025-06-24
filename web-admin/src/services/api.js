// services/api.jsx
import axios from 'axios';

export const BACKEND_URL = 'http://localhost:8082';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 10000,
  withCredentials: true, // ESSENCIAL
});

// ... (interceptador de resposta opcional) ...

export default api;