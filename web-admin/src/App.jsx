// src/App.jsx
import React from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Header from './modules/Home/components/Header'
import Home from './modules/Home/Home'
import TelaDeDescricaoDeSolicitacaoHortas from './modules/Solicitacoes/TelaDeDescricaoDeSolicitacaoHortas'

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
        {/* Rota HOME: exatamente no caminho "/" */}
        <Route index element={<Home />} />

        {/* Rota de descrição */}
        <Route
          path="tela-de-descricao-de-solicitacao-hortas"
          element={<TelaDeDescricaoDeSolicitacaoHortas />}
        />

        {/* Qualquer outro caminho volta para Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
