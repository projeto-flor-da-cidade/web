// src/routes/ProtectedRoute.jsx
import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { token, loading } = useContext(AuthContext)

  // Enquanto estiver carregando (por ex., verificando token), exibe nada ou um spinner
  if (loading) {
    return null // ou retorne um componente de carregamento
  }

  // Se não houver token, redireciona para login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Caso contrário, renderiza as rotas filhas
  return <Outlet />
}
