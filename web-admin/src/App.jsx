// src/App.jsx

import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

// --- Componentes do Layout ---
import Header from "./modules/Home/components/Header";

// --- Páginas da Aplicação ---
import Home from "./modules/Home/Home";
import TelaDeSolicitacaoHortas from "./modules/Solicitacoes/hortas/TelaDeSolicitacaoHortas";
import TelaDeDescricaoDeSolicitacaoHortas from "./modules/Solicitacoes/hortas/TelaDeDescricaoDeSolicitacaoHortas";
import TelaDeCadastroDeCurso from "./modules/Solicitacoes/cursos/TelaDeCadastroDeCurso";
import TelaDeCursosAtivos from "./modules/Solicitacoes/cursos/TelaDeCursosAtivos";
import TelaDeEdicaoDeCursos from "./modules/Solicitacoes/cursos/TelaDeEdicaoDeCursos";
import TelaHortasAtivas from "./modules/Solicitacoes/hortas/TelaHortasAtivas";
import TelaDeRelatorios from "./modules/relatorios/TelaDeRelatorios";
import CriarModeloRelatorio from "./modules/relatorios/SubTelasRelatorio/CriarModeloRelatorio";
import CriarRelatorioAcolhimento from "./modules/relatorios/SubTelasRelatorio/CriarRelatorioAcolhimento";
import CriarRelatorioAcompanhamento from "./modules/relatorios/SubTelasRelatorio/CriarRelatorioAcompanhamento";
import EditarRelatorio from "./modules/relatorios/SubTelasRelatorio/EditarRelatorio";
import TelaDeLoginAdmin from "./modules/auth/TelaDeLoginAdmin";
import RecuperarSenha from "./modules/auth/RecuperarSenha";


// --- Definição do Componente de Layout ---
// Este layout agora é um invólucro simples e correto.
function ProtectedLayout() {
  return (
    <>
      <Header />
      {/* 
        A tag <main> é semanticamente correta para o conteúdo principal.
        O padding-top (pt-16) empurra o conteúdo da página para baixo do Header fixo.
      */}
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
}


// --- Componente Principal da Aplicação com as Rotas ---
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TelaDeLoginAdmin />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/app" element={<ProtectedLayout />}>
        <Route index element={<Navigate to="/app/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="tela-de-solicitacao-hortas" element={<TelaDeSolicitacaoHortas />} />
        <Route path="tela-de-descricao-de-solicitacao-hortas" element={<TelaDeDescricaoDeSolicitacaoHortas />} />
        <Route path="tela-de-cadastro-de-curso" element={<TelaDeCadastroDeCurso />} />
        <Route path="tela-de-cursos-ativos" element={<TelaDeCursosAtivos />} />
        <Route path="tela-de-edicao-de-cursos/:id" element={<TelaDeEdicaoDeCursos />} />
        <Route path="tela-hortas-ativas" element={<TelaHortasAtivas />} />
        <Route path="tela-de-relatorios" element={<TelaDeRelatorios />} />
        <Route path="criar-modelo-relatorio" element={<CriarModeloRelatorio />} />
        <Route path="criar-relatorio-acolhimento" element={<CriarRelatorioAcolhimento />} />
        <Route path="criar-relatorio-acompanhamento" element={<CriarRelatorioAcompanhamento />} />
        <Route path="editar-relatorio" element={<EditarRelatorio />} />
        <Route path="*" element={<Navigate to="/app/home" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}