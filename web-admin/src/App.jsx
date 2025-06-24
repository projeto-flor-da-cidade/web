import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

// --- Componentes do Layout ---
import Header from "./modules/Home/components/Header";

// --- Páginas da Aplicação ---
import Home from "./modules/Home/Home";
import TelaDeSolicitacaoHortas from "./modules/Solicitacoes/hortas/TelaDeSolicitacaoHortas";
import TelaDeDescricaoDeSolicitacaoHortas from "./modules/Solicitacoes/hortas/TelaDeDescricaoDeSolicitacaoHortas";
import TelaEdicaoHorta from "./modules/Solicitacoes/hortas/TelaEdicaoHorta";
import TelaDeCadastroDeCurso from "./modules/Solicitacoes/cursos/TelaDeCadastroDeCurso";
import TelaDeCursosAtivos from "./modules/Solicitacoes/cursos/TelaDeCursosAtivos";
import TelaDeEdicaoDeCursos from "./modules/Solicitacoes/cursos/TelaDeEdicaoDeCursos";
import TelaHortasAtivas from "./modules/Solicitacoes/hortas/TelaHortasAtivas"; // Presumo que seja o TelaGerenciamentoHortas
import TelaDeRelatorios from "./modules/relatorios/TelaDeRelatorios";
import CriarModeloRelatorio from "./modules/relatorios/SubTelasRelatorio/CriarModeloRelatorio";
import CriarRelatorioAcolhimento from "./modules/relatorios/SubTelasRelatorio/CriarRelatorioAcolhimento";
import CriarRelatorioAcompanhamento from "./modules/relatorios/SubTelasRelatorio/CriarRelatorioAcompanhamento";
import EditarRelatorio from "./modules/relatorios/SubTelasRelatorio/EditarRelatorio";
import TelaDeLoginAdmin from "./modules/auth/TelaDeLoginAdmin";
import RecuperarSenha from "./modules/auth/RecuperarSenha";


function ProtectedLayout() {
  return (
    <>
      <Header />
      <main className="pt-16"> {/* Garante que o conteúdo não fique sob o Header fixo */}
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TelaDeLoginAdmin />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      
      {/* Rotas protegidas que usam o ProtectedLayout */}
      <Route path="/app" element={<ProtectedLayout />}>
        {/* Redireciona /app para /app/home */}
        <Route index element={<Navigate to="/app/home" replace />} /> 
        
        <Route path="home" element={<Home />} />
        
        {/* Rotas de Hortas */}
        <Route path="tela-de-solicitacao-hortas" element={<TelaDeSolicitacaoHortas />} />
        {/* CORREÇÃO APLICADA AQUI: Adicionado /:id */}
        <Route 
          path="tela-de-descricao-de-solicitacao-hortas/:id" 
          element={<TelaDeDescricaoDeSolicitacaoHortas />} 
        />
        {/* Assumindo que TelaHortasAtivas é a tela de gerenciamento que fizemos */}
        <Route path="tela-hortas-ativas" element={<TelaHortasAtivas />} /> 
        {/* Adicionar rotas para editar e cadastrar hortas se necessário */}
        {/* Ex: <Route path="hortas/cadastrar" element={<TelaCadastroHorta />} /> */}
        <Route path="hortas-editar/:id" element={<TelaEdicaoHorta />} />

        {/* Rotas de Cursos */}
        <Route path="tela-de-cadastro-de-curso" element={<TelaDeCadastroDeCurso />} />
        <Route path="tela-de-cursos-ativos" element={<TelaDeCursosAtivos />} />
        <Route path="tela-de-edicao-de-cursos/:id" element={<TelaDeEdicaoDeCursos />} />
        
        {/* Rotas de Relatórios */}
        <Route path="tela-de-relatorios" element={<TelaDeRelatorios />} />
        <Route path="criar-modelo-relatorio" element={<CriarModeloRelatorio />} />
        <Route path="criar-relatorio-acolhimento" element={<CriarRelatorioAcolhimento />} />
        <Route path="criar-relatorio-acompanhamento" element={<CriarRelatorioAcompanhamento />} />
        <Route path="editar-relatorio" element={<EditarRelatorio />} /> {/* Se relatórios têm ID, seria editar-relatorio/:id */}
        
        {/* Fallback para qualquer rota não encontrada dentro de /app, redireciona para /app/home */}
        <Route path="*" element={<Navigate to="/app/home" replace />} /> 
      </Route>
      
      {/* Fallback global para qualquer rota não encontrada, redireciona para a tela de login */}
      <Route path="*" element={<Navigate to="/" replace />} /> 
    </Routes>
  );
}