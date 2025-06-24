// src/components/PrivateRoute.jsx (ou onde estiver)
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PrivateRoute = () => {
  const location = useLocation(); // Para logar a rota que está tentando ser acessada
  const usuarioItem = localStorage.getItem('usuario');
  const isAuthenticated = !!usuarioItem; // Converte para booleano

  // --- LOG DE DEPURAÇÃO ---
  console.log("--- PrivateRoute ---");
  console.log("Rota atual:", location.pathname);
  console.log("Conteúdo de localStorage 'usuario':", usuarioItem);
  console.log("Está autenticado (isAuthenticated):", isAuthenticated);
  // --- FIM DO LOG ---

  if (!isAuthenticated) {
    console.warn("PrivateRoute: Usuário NÃO autenticado. Redirecionando para / (login).");
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;