import { createContext } from 'react'

// Cria o contexto com valores padrão (placeholders)
export const AuthContext = createContext({
  user: null,                // objeto usuário { id, nome, matricula } ou null
  token: null,               // string JWT ou null
  loading: true,             // indica carregamento inicial
  error: null,               // string de erro de login
  login: async () => false,  // função para logar retorna boolean
  logout: () => {}           // função para deslogar
})
