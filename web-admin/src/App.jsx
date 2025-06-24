import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

// --- Componentes do Layout ---
import Header from "./modules/Home/components/Header"; // Verifique este caminho
import PrivateRoute from "./components/PrivateRoute";   // VERIFIQUE ESTE CAMINHO

// --- Páginas da Aplicação ---
import Home from "./modules/Home/Home";
import TelaDeLoginAdmin from "./modules/auth/TelaDeLoginAdmin";
import RecuperarSenha from "./modules/auth/RecuperarSenha";

import TelaDeSolicitacaoHortas from "./modules/Solicitacoes/hortas/TelaDeSolicitacaoHortas";
import TelaDeDescricaoDeSolicitacaoHortas from "./modules/Solicitacoes/hortas/TelaDeDescricaoDeSolicitacaoHortas";
import TelaEdicaoHorta from "./modules/Solicitacoes/hortas/TelaEdicaoHorta";
import TelaHortasAtivas from "./modules/Solicitacoes/hortas/TelaHortasAtivas";

import TelaDeCadastroDeCurso from "./modules/Solicitacoes/cursos/TelaDeCadastroDeCurso";
import TelaDeCursosAtivos from "./modules/Solicitacoes/cursos/TelaDeCursosAtivos";
import TelaDeEdicaoDeCursos from "./modules/Solicitacoes/cursos/TelaDeEdicaoDeCursos";

import TelaDeRelatorios from "./modules/relatorios/TelaDeRelatorios";
import CriarModeloRelatorio from "./modules/relatorios/SubTelasRelatorio/CriarModeloRelatorio";
import CriarRelatorioAcolhimento from "./modules/relatorios/SubTelasRelatorio/CriarRelatorioAcolhimento";
import CriarRelatorioAcompanhamento from "./modules/relatorios/SubTelasRelatorio/CriarRelatorioAcompanhamento";
import EditarRelatorio from "./modules/relatorios/SubTelasRelatorio/EditarRelatorio";

import TelaCadastroTecnico from "./modules/tecnico/TelaCadastroTecnico"; // Verifique este caminho

// Layout para rotas protegidas
function ProtectedLayout() {
  return (
    <>
      <Header />
      <main className="pt-16"> {/* Ajuste 'pt-16' conforme a altura real do seu Header */}
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<TelaDeLoginAdmin />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      
      {/* Rotas Protegidas */}
      <Route element={<PrivateRoute />}> {/* Protege todas as rotas aninhadas aqui */}
        <Route path="/app" element={<ProtectedLayout />}>
          <Route index element={<Navigate to="home" replace />} /> {/* Redireciona /app para /app/home */}
          
          <Route path="home" element={<Home />} />
          
          {/* Rotas de Hortas */}
          <Route path="tela-de-solicitacao-hortas" element={<TelaDeSolicitacaoHortas />} />
          <Route path="tela-de-descricao-de-solicitacao-hortas/:id" element={<TelaDeDescricaoDeSolicitacaoHortas />} />
          <Route path="tela-hortas-ativas" element={<TelaHortasAtivas />} /> 
          <Route path="hortas-editar/:id" element={<TelaEdicaoHorta />} /> {/* Padronizado */}

          {/* Rotas de Cursos */}
          <Route path="tela-de-cadastro-de-curso" element={<TelaDeCadastroDeCurso />} />
          <Route path="tela-de-cursos-ativos" element={<TelaDeCursosAtivos />} />
          <Route path="tela-de-edicao-de-cursos/:id" element={<TelaDeEdicaoDeCursos />} />
          
          {/* Rotas de Relatórios */}
          <Route path="tela-de-relatorios" element={<TelaDeRelatorios />} />
          <Route path="criar-modelo-relatorio" element={<CriarModeloRelatorio />} />
          <Route path="criar-relatorio-acolhimento" element={<CriarRelatorioAcolhimento />} />
          <Route path="criar-relatorio-acompanhamento" element={<CriarRelatorioAcompanhamento />} />
          {/* Se relatórios têm ID para edição, a rota seria "editar-relatorio/:id" */}
          <Route path="editar-relatorio/:id" element={<EditarRelatorio />} /> {/* Exemplo com ID */} 
          
          {/* Rotas de Técnico */}
          <Route path="tela-de-cadastro-tecnico" element={<TelaCadastroTecnico />} />
          {/* Adicionar aqui rotas para listar/editar técnicos se necessário */}
          {/* Ex: <Route path="gerenciamento-tecnicos" element={<TelaGerenciamentoTecnicos />} /> */}
          {/* Ex: <Route path="tecnicos/editar/:id" element={<TelaEdicaoTecnico />} /> */}

          {/* Fallback para qualquer rota não encontrada dentro de /app, redireciona para /app/home */}
          <Route path="*" element={<Navigate to="home" replace />} /> 
        </Route>
      </Route>
      
      {/* Fallback global para qualquer rota não encontrada, redireciona para a tela de login */}
      <Route path="*" element={<Navigate to="/" replace />} /> 
    </Routes>
  );
}