// src/App.jsx
import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

// A importação do Header deve estar aqui no topo, uma única vez.
import Header from "./modules/Home/components/Header";

import Home from "./modules/Home/Home";
import TelaDeSolicitacaoHortas from "./modules/Solicitacoes/TelaDeSolicitacaoHortas";
import TelaDeDescricaoDeSolicitacaoHortas from "./modules/Solicitacoes/TelaDeDescricaoDeSolicitacaoHortas";
import TelaDeCadastroDeCurso from "./modules/Solicitacoes/cursos/TelaDeCadastroDeCurso";
import TelaDeCursosAtivos from "./modules/Solicitacoes/cursos/TelaDeCursosAtivos";
import TelaDeEdicaoDeCursos from "./modules/Solicitacoes/cursos/TelaDeEdicaoDeCursos";
import TelaHortasAtivas from "./modules/Solicitacoes/hortas/TelaHortasAtivas";

import TelaDeRelatorios from "./modules/TelaDeRelatorios";
import CriarModeloRelatorio from "./modules/SubTelasRelatorio/CriarModeloRelatorio";
import CriarRelatorioAcolhimento from "./modules/SubTelasRelatorio/CriarRelatorioAcolhimento";
import CriarRelatorioAcompanhamento from "./modules/SubTelasRelatorio/CriarRelatorioAcompanhamento";
import EditarRelatorio from "./modules/SubTelasRelatorio/EditarRelatorio";

import TelaDeLoginAdmin from "./modules/TelaDeLoginAdmin";
import RecuperarSenha from "./modules/RecuperarSenha";

// O Layout Protegido usa o Header importado no topo do arquivo.
function ProtectedLayout() {
  return (
    <>
      <Header />
      <main className="pt-16"> {/* Adiciona padding top para não ficar atrás do header fixo */}
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* 1) Rotas Públicas */}
      <Route path="/" element={<TelaDeLoginAdmin />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />

      {/* 2) Rotas Protegidas dentro do Layout /app */}
      <Route path="/app" element={<ProtectedLayout />}>
        
        {/* Redirecionamento para um caminho ABSOLUTO */}
        <Route index element={<Navigate to="/app/home" replace />} />

        {/* Rotas internas */}
        <Route path="home" element={<Home />} />
        <Route path="tela-de-solicitacao-hortas" element={<TelaDeSolicitacaoHortas />} />
        <Route path="tela-de-descricao-de-solicitacao-hortas" element={<TelaDeDescricaoDeSolicitacaoHortas />} />
        <Route path="tela-de-cadastro-de-curso" element={<TelaDeCadastroDeCurso />} />
        <Route path="tela-de-cursos-ativos" element={<TelaDeCursosAtivos />} />
        
        {/* Rota de Edição com o parâmetro :id */}
        <Route path="tela-de-edicao-de-cursos/:id" element={<TelaDeEdicaoDeCursos />} />

        <Route path="tela-hortas-ativas" element={<TelaHortasAtivas />} />

        {/* Rotas de relatórios */}
        <Route path="tela-de-relatorios" element={<TelaDeRelatorios />} />
        <Route path="criar-modelo-relatorio" element={<CriarModeloRelatorio />} />
        <Route path="criar-relatorio-acolhimento" element={<CriarRelatorioAcolhimento />} />
        <Route path="criar-relatorio-acompanhamento" element={<CriarRelatorioAcompanhamento />} />
        <Route path="editar-relatorio" element={<EditarRelatorio />} />

        {/* Rota "Catch-All" com caminho ABSOLUTO */}
        <Route path="*" element={<Navigate to="/app/home" replace />} />
      </Route>

      {/* 3) Fallback final: Qualquer outra URL volta para a raiz (Login) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}