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
import TelaHortasAtivas from './modules/Solicitacoes/hortas/hortasAtivas'

function Layout() {
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
      {/* Rota pai com Header e Outlet */}
      <Route path="/" element={<Layout />}>
        {/* Rota HOME */}
        <Route index element={<Home />} />

        {/* Rota de solicitação de horta */}
        <Route
          path="tela-de-solicitacao-hortas"
          element={<TelaDeSolicitacaoHortas />}
        />

        {/* Rota de descrição */}
        <Route
          path="tela-de-descricao-de-solicitacao-hortas"
          element={<TelaDeDescricaoDeSolicitacaoHortas />}
        />

        {/* Rota de cadastro de curso */}
        <Route
          path="tela-de-cadastro-de-curso"
          element={<TelaDeCadastroDeCurso />}
        />

        {/* Rota de cursos ativos */}
        <Route
          path="tela-de-cursos-ativos"
          element={<TelaDeCursosAtivos />}
        />

        {/* Rota de edição de cursos */}
        <Route
          path="tela-de-edicao-de-cursos"
          element={<TelaDeEdicaoDeCursos />}
        />

        {/* Rota de hortas ativas */}
        <Route
          path="tela-hortas-ativas"
          element={<TelaHortasAtivas />}
        />

        {/* Qualquer outro caminho volta para Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
