import React, { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { getToken, setToken, removeToken } from '../services/tokenService'
import { login as doLogin } from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(getToken())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Ao montar ou quando o token muda, popula o user ou limpa o loading
  useEffect(() => {
    if (token) {
      // opcional: decodificar o token para extrair claims
      setUser({ token })
    }
    setLoading(false)
  }, [token])

  // Função de login: chama a API, trata token e erros
  const login = async (matricula, senha) => {
    setError(null)
    try {
      const data = await doLogin(matricula, senha)
      setToken(data.token)           // persiste no localStorage
      setTokenState(data.token)      // atualiza state
      setUser({                     // preenche user com dados retornados
        id: data.id,
        nome: data.nome,
        matricula: data.matricula
      })
      return true
    } catch (err) {
      // Mensagem vinda do back ou do axios
      setError(err.response?.data?.error || err.message)
      return false
    }
  }

  // Função de logout: limpa tudo
  const logout = () => {
    removeToken()
    setTokenState(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}
