// src/components/PrivateRoute.jsx (ou onde quer que ele esteja)

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Verificamos se existe o item 'usuario' salvo no localStorage
  const isAuthenticated = !!localStorage.getItem('usuario'); 

  // A lógica permanece a mesma: se estiver "autenticado", mostra o conteúdo.
  // Se não, redireciona para a página de login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;