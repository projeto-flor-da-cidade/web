// services/api.jsx
import axios from 'axios';

export const BACKEND_URL = 'http://localhost:8082'; // Ou a porta/URL correta do seu backend

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`, // A baseURL da sua API continua sendo /api
  timeout: 5000,
});

export default api;