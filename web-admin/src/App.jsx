// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { AuthProvider } from './context/AuthProvider'
import ProtectedRoute from './routes/ProtectedRoute'

import Header from './modules/Home/components/Header'
import Home from './modules/Home/Home'
import TelaDeSolicitacaoHortas from './modules/Solicitacoes/TelaDeSolicitacaoHortas'
import TelaDeDescricaoDeSolicitacaoHortas from './modules/Solicitacoes/TelaDeDescricaoDeSolicitacaoHortas'
import TelaDeCadastroDeCurso from './modules/Solicitacoes/cursos/TelaDeCadastroDeCurso'
import TelaDeCursosAtivos from './modules/Solicitacoes/cursos/TelaDeCursosAtivos'
import TelaDeEdicaoDeCursos from './modules/Solicitacoes/cursos/TelaDeEdicaoDeCursos'
import TelaHortasAtivas from './modules/Solicitacoes/hortas/TelaHortasAtivas'
import TelaDeLoginAdmin from './modules/TelaDeLoginAdmin'

function AppLayout() {
  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<TelaDeLoginAdmin />} />
        <Route path="/app" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="tela-de-solicitacao-hortas" element={<TelaDeSolicitacaoHortas />} />
            <Route path="tela-de-descricao-de-solicitacao-hortas" element={<TelaDeDescricaoDeSolicitacaoHortas />} />
            <Route path="tela-de-cadastro-de-curso" element={<TelaDeCadastroDeCurso />} />
            <Route path="tela-de-cursos-ativos" element={<TelaDeCursosAtivos />} />
            <Route path="tela-de-edicao-de-cursos" element={<TelaDeEdicaoDeCursos />} />
            <Route path="tela-hortas-ativas" element={<TelaHortasAtivas />} />
            <Route path="*" element={<Navigate to="home" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
