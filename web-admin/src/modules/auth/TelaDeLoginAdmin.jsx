// src/modules/auth/TelaDeLoginAdmin.jsx (ou o caminho correto do seu arquivo)

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Verifique se este caminho está correto

import eyeOutline from "../../assets/eye-outline.svg";
import eyeOffOutline from "../../assets/eye-off-outline.svg";

export default function TelaDeLoginAdmin() {
  // --- ESTADOS ---
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- HANDLERS ---
  const handleMatriculaChange = (e) => {
    const valor = e.target.value.replace(/\D/g, "").slice(0, 8);
    setMatricula(valor);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const resp = await api.post("/login", { matricula, senha });

      // =================================================================
      // LÓGICA DA SOLUÇÃO 1: Validar pela resposta de sucesso (status 200)
      // =================================================================
      if (resp.status === 200 && resp.data) {
        // Para debugging, é ótimo ver o que o servidor respondeu.
        console.log("Login bem-sucedido. Dados recebidos:", resp.data);

        // Em vez de um token, salvamos os dados do usuário no localStorage.
        // JSON.stringify é necessário porque o localStorage só armazena strings.
        localStorage.setItem("usuario", JSON.stringify(resp.data));
        
        // Navega para a home da aplicação.
        navigate("/app/home", { replace: true });
      } else {
        // Isso aconteceria se o servidor desse status 200 mas com corpo vazio.
        setError("Resposta inesperada do servidor.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Matrícula ou senha inválidos.");
      } else {
        // Este log é útil para ver erros de CORS ou de rede no console.
        console.error("Falha na requisição:", err);
        setError("Não foi possível conectar ao servidor. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZAÇÃO ---
  // O JSX abaixo já está correto e responsivo, sem necessidade de mudanças.
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fff2f2] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-poppins font-semibold text-[#60855f]">
            Flor da Cidade
          </h1>
          <p className="text-4xl font-montserrat font-bold text-black mt-1">
            Admin
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full">
          {/* ... todo o resto do seu formulário JSX permanece o mesmo ... */}
          <div className="space-y-6">
            <div>
              <label htmlFor="usuario" className="block font-nunito text-gray-700 mb-1">
                Usuário
              </label>
              <input
                id="usuario"
                type="text"
                value={matricula}
                onChange={handleMatriculaChange}
                maxLength={8}
                inputMode="numeric"
                className="w-full border border-gray-300 rounded px-3 py-2 font-nunito focus:outline-none focus:ring-2 focus:ring-[#60855f]"
                placeholder="Digite os 8 dígitos da matrícula"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block font-nunito text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 font-nunito focus:outline-none focus:ring-2 focus:ring-[#60855f] pr-10"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  <img
                    src={mostrarSenha ? eyeOffOutline : eyeOutline}
                    alt="Ícone de olho para mostrar/ocultar senha"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-nunito font-semibold text-white bg-[#60855f] hover:bg-[#4e6e52] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#60855f] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/recuperar-senha"
              className="font-nunito text-sm underline text-gray-600 hover:text-gray-800"
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}