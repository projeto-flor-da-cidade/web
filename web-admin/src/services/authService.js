import { api } from './api'

/**
 * Tenta logar no back-end. 
 * @param {string} matricula 
 * @param {string} senha 
 * @returns {Promise<TecnicoResponseDTO>}
 */
export function login(matricula, senha) {
  return api
    .post('/auth/login', { matricula, senha })
    .then(res => res.data)
}
