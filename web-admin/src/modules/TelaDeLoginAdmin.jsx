// src/modules/TelaDeLoginAdmin.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import eyeOutline from '../assets/eye-outline.svg'

export default function TelaDeLoginAdmin() {
  const [usuario, setUsuario] = useState('01458479')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const navigate = useNavigate()

  const handleUsuarioChange = (e) => {
    // filtra apenas dígitos e limita a 8 caracteres
    const valor = e.target.value.replace(/\D/g, '').slice(0, 8)
    setUsuario(valor)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // aqui você pode validar credenciais antes de navegar
    navigate('/app/home', { replace: true })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fff2f2] px-4">
      <div
        className="bg-white rounded-lg shadow-lg flex flex-col items-center p-8"
        style={{ width: '440.3px', height: '549.5px' }}
      >
        {/* Título */}
        <h1 className="text-5xl mb-8 text-center">
          <span className="block font-poppins font-semibold text-[#60855f]">
            Flor da Cidade
          </span>
          <span className="block font-montserrat font-bold text-black">
            Admin
          </span>
        </h1>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="w-full flex-1 flex flex-col justify-between">
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Usuário */}
            <label className="block font-nunito text-gray-700">
              Usuário
              <input
                type="text"
                value={usuario}
                onChange={handleUsuarioChange}
                maxLength={8}
                inputMode="numeric"
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 font-nunito focus:outline-none focus:ring-2 focus:ring-[#60855f]"
                placeholder="Digite 8 dígitos"
              />
            </label>

            {/* Senha */}
            <label className="block font-nunito text-gray-700 relative">
              Senha
              <input
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 font-nunito focus:outline-none focus:ring-2 focus:ring-[#60855f] pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(prev => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"
              >
                <img
                  src={eyeOutline}
                  alt={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="w-5 h-5"
                />
              </button>
            </label>

            {/* Botão Entrar */}
            <button
              type="submit"
              className="w-full py-3 rounded font-nunito font-semibold text-white bg-[#60855f] hover:bg-[#4e6e52] transition-colors"
            >
              Entrar
            </button>
          </div>

          {/* Esqueci minha senha */}
          <div className="text-center mt-6">
            <Link
              to="/esqueci-senha"
              className="font-nunito text-sm underline text-gray-600 hover:text-gray-800"
            >
              Esqueci minha senha...
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
