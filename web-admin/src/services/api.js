// src/services/api.js
import axios from 'axios'
import { getToken, removeToken } from './tokenService'

// Cria instância axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,  // opcional: timeout de 10s
})

// Interceptor de requisição: adiciona Authorization Bearer <token>
api.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Interceptor de resposta: lidar com erros globais
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error
    if (response) {
      // se 401 ou 403, expira o token e redireciona pro login
      if (response.status === 401 || response.status === 403) {
        removeToken()
        // Se você estiver dentro de um hook/React context, use useNavigate()
        // Aqui um fallback simples:
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
