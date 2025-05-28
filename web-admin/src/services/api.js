// exporta uma instância axios já “pré-configurada”
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // ajuste a porta se necessário
  timeout: 5000,
});

export default api;
