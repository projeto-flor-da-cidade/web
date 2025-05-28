// src/App.jsx
import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

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

function ProtectedLayout() {
  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* 1) Raiz ("/") leva direto ao Login */}
      <Route path="/" element={<TelaDeLoginAdmin />} />
      <Route path="RecuperarSenha" element={<RecuperarSenha />} />

      {/* 2) Depois de logar, o usuário navega para /app/* */}
      <Route path="/app" element={<ProtectedLayout />}>
        {/* Redireciona /app para /app/home */}
        <Route index element={<Navigate to="home" replace />} />

        {/* Rotas internas protegidas */}
        <Route path="home" element={<Home />} />
        <Route
          path="tela-de-solicitacao-hortas"
          element={<TelaDeSolicitacaoHortas />}
        />
        <Route
          path="tela-de-descricao-de-solicitacao-hortas"
          element={<TelaDeDescricaoDeSolicitacaoHortas />}
        />
        <Route
          path="tela-de-cadastro-de-curso"
          element={<TelaDeCadastroDeCurso />}
        />
        <Route path="tela-de-cursos-ativos" element={<TelaDeCursosAtivos />} />
        <Route
          path="tela-de-edicao-de-cursos"
          element={<TelaDeEdicaoDeCursos />}
        />
        <Route path="tela-hortas-ativas" element={<TelaHortasAtivas />} />

        {/* Rotas de relatórios */}
        <Route path="tela-de-relatorios" element={<TelaDeRelatorios />} />
        <Route
          path="criar-modelo-relatorio"
          element={<CriarModeloRelatorio />}
        />
        <Route
          path="criar-relatorio-acolhimento"
          element={<CriarRelatorioAcolhimento />}
        />
        <Route
          path="criar-relatorio-acompanhamento"
          element={<CriarRelatorioAcompanhamento />}
        />
        <Route path="editar-relatorio" element={<EditarRelatorio />} />

        {/* Qualquer outra rota em /app volta para /app/home */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Route>

      {/* 3) Qualquer outra URL fora de "/" e "/app/*" volta para "/" (Login) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
