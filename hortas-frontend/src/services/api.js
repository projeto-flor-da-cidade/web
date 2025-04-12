import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/// Interceptor para adicionar o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com respostas de erro (e.g., 401 - Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      const mensagemErro =
        error.response.data.message || "Ocorreu um erro inesperado.";

      switch (status) {
        case 400:
          toast.error(mensagemErro); // Exibir erro ao usuário
          break;
        case 401:
          toast.error("Sessão expirada. Faça login novamente.");
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          break;
        case 403:
          toast.error(
            "Você não tem permissão para acessar esta funcionalidade."
          );
          break;
        case 404:
          toast.error("Recurso não encontrado. Verifique se a URL está correta.");
          break;
        case 500:
          toast.error("Erro interno do servidor. Tente novamente mais tarde.");
          break;
        default:
          toast.error("Erro desconhecido. Entre em contato com o suporte.");
      }

      return Promise.reject(error);
    } else {
      toast.error("Sem resposta do servidor. Verifique sua conexão com a internet.");
    }

    return Promise.reject(error);
  }
);

export default api;
