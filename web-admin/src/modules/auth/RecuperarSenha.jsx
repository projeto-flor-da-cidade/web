import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function TelaDeLoginAdmin() {
  const [usuario, setUsuario] = useState("usuario@email.com.br");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUsuarioChange = (e) => {
    setUsuario(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const resp = await api.post("/login", {
        matricula: usuario,
      });
      if (resp.status === 200) {
        navigate("/app/home", { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Matrícula ou senha inválidos.");
      } else {
        setError("Problema de conexão. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fff2f2] px-4">
      <div
        className="bg-white rounded-lg shadow-lg flex flex-col items-center p-8"
        style={{ width: "440px", height: "550px" }}
      >
        <h1 className="text-5xl mb-8 text-center">
          <span className="block font-poppins font-semibold text-[#60855f]">
            Flor da Cidade
          </span>
          <span className="block font-montserrat font-bold text-black">
            Admin
          </span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="w-full flex-1 flex flex-col justify-between"
        >
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <h1 className="text-3xl mb-8 text-center">
              <label className="block font-montserrat">Recuperar Senha</label>
            </h1>

            <label className="block font-nunito text-gray-700">
              Informe seu e-mail
              <input
                type="text"
                value={usuario}
                onChange={handleUsuarioChange}
                maxLength={100}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 font-nunito focus:outline-none focus:ring-2 focus:ring-[#60855f]"
              />
            </label>

            <label className="block font-nunito text-gray-700">
              Verifique sua caixa de e-mail para realizar o procedimento de
              recuperação de senha.
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded font-nunito font-semibold text-white bg-[#60855f] hover:bg-[#4e6e52] transition-colors"
            >
              Confirmar
            </button>

            {/* Aqui exibimos o erro */}
            {error && (
              <p className="mt-2 text-center text-sm text-red-600 font-nunito">
                {error}
              </p>
            )}
          </div>

          <div className="text-center mt-6">
            <Link
              to="/TelaDeLoginAdmin"
              className="font-nunito text-lg underline text-gray-600 hover:text-gray-800"
            >
              Voltar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
