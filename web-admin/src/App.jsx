// src/App.jsx
import React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'

import Header from './modules/Home/components/Header'
import Home from './modules/Home/Home'
import TelaDeSolicitacaoHortas from './modules/Solicitacoes/TelaDeSolicitacaoHortas'
import TelaDeDescricaoDeSolicitacaoHortas from './modules/Solicitacoes/TelaDeDescricaoDeSolicitacaoHortas'
import TelaDeCadastroDeCurso from './modules/Solicitacoes/cursos/TelaDeCadastroDeCurso'
import TelaDeCursosAtivos from './modules/Solicitacoes/cursos/TelaDeCursosAtivos'
import TelaDeEdicaoDeCursos from './modules/Solicitacoes/cursos/TelaDeEdicaoDeCursos'
import TelaHortasAtivas from './modules/Solicitacoes/hortas/TelaHortasAtivas'
import TelaDeLoginAdmin from './modules/TelaDeLoginAdmin'

function ProtectedLayout() {
  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* 1) Raiz ("/") leva direto ao Login */}
      <Route path="/" element={<TelaDeLoginAdmin />} />

      {/* 2) Depois de logar, o usuário deve navegar para /app/* */}
      <Route path="/app" element={<ProtectedLayout />}>
        {/* index aqui já cai em /app/home */}
        <Route index element={<Navigate to="home" replace />} />

        {/* Rotas internas protegidas */}
        <Route path="home" element={<Home />} />
        <Route path="tela-de-solicitacao-hortas" element={<TelaDeSolicitacaoHortas />} />
        <Route path="tela-de-descricao-de-solicitacao-hortas" element={<TelaDeDescricaoDeSolicitacaoHortas />} />
        <Route path="tela-de-cadastro-de-curso" element={<TelaDeCadastroDeCurso />} />
        <Route path="tela-de-cursos-ativos" element={<TelaDeCursosAtivos />} />
        <Route path="tela-de-edicao-de-cursos" element={<TelaDeEdicaoDeCursos />} />
        <Route path="tela-hortas-ativas" element={<TelaHortasAtivas />} />

        {/* qualquer /app/xxxx que não bata cai em /app/home */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Route>

      {/* 3) qualquer outra URL (fora / e /app) volta para "/" (Login) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
