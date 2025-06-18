// src/modules/relatorios/TelaDeRelatorios.jsx

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { FaPlus, FaEdit, FaDownload, FaSpinner, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api"; // USANDO A INSTÂNCIA CENTRALIZADA
import { useClickOutside } from "../../hooks/useClickOutside";

// --- UTILITIES E CONSTANTES ---

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Garante que a data seja tratada como UTC para evitar problemas de fuso horário
  const date = new Date(dateString);
  const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return new Intl.DateTimeFormat('pt-BR').format(utcDate);
};

const FILTER_TYPES = ["Todos", "Curso", "Oficina", "Modelo"];
const SORT_OPTIONS = [
  { label: "Data Recente", key: "data" },
  { label: "Nome (A-Z)", key: "nome" },
];

// --- SUB-COMPONENTES PARA MAIOR CLAREZA E REUTILIZAÇÃO ---

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'Ativo': 'bg-green-100 text-green-800',
    'Disponível': 'bg-blue-100 text-blue-800',
    'Desativado': 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${statusStyles[status] || 'bg-yellow-100 text-yellow-800'}`}>
      {status || "—"}
    </span>
  );
};

const RelatorioCard = ({ item }) => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    const path = item.isCurso 
      ? `/app/tela-de-edicao-de-cursos/${item.id}` 
      : `/app/editar-relatorio/${item.id}`;
    navigate(path);
  };

  return (
    <div className="flex flex-col justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div>
        <p className="font-semibold text-gray-800 break-words leading-tight">{item.nome}</p>
        <p className="text-gray-500 text-sm mt-1">{item.tipo} – {formatDate(item.data)}</p>
        <div className="text-gray-600 text-sm mt-2 flex items-center gap-2">
          <span>Status:</span>
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button 
          onClick={handleNavigation} 
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors" 
          aria-label={`Editar ${item.nome}`}
        >
          <FaEdit className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---

export default function TelaDeRelatorios() {
  const navigate = useNavigate();

  // Estados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("data");
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  const optionsMenuRef = useRef(null);
  useClickOutside(optionsMenuRef, () => setShowOptions(false));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Usando a instância 'api'
        const cursosResponse = await api.get('/cursos'); 
        const cursosData = cursosResponse.data.map(c => ({
          id: c.idCurso, nome: c.nome, tipo: c.tipoAtividade, data: c.dataInicio,
          status: c.ativo ? 'Ativo' : 'Desativado', isCurso: true,
        }));
        
        // ANÁLISE PROFISSIONAL: Manter mock data é útil para dev, mas deve ser substituído por uma API.
        const modelosData = [
          { id: 'modelo-1', nome: "Modelo - Horta Acompanhamento", tipo: "Modelo", data: "2024-01-01", status: "Disponível", isCurso: false },
        ];

        setData([...cursosData, ...modelosData]);
        setError(null);
      } catch (err) {
        setError("Não foi possível carregar os dados. Verifique a conexão.");
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const filteredData = useMemo(() => {
    let items = [...data];
    if (activeFilter !== "Todos") {
      items = items.filter(item => item.tipo === activeFilter);
    }
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      items = items.filter(item => item.nome.toLowerCase().includes(term));
    }
    return items;
  }, [data, activeFilter, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortKey === "data") return new Date(b.data) - new Date(a.data);
      if (sortKey === "nome") return a.nome.localeCompare(b.nome);
      return 0;
    });
  }, [sortKey, filteredData]);

  const handleDownloadCursos = useCallback(async () => {
    setIsDownloading(true);
    setShowOptions(false);
    try {
      // Usando a instância 'api'
      const response = await api.get('/cursos/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().slice(0, 10);
      link.setAttribute('download', `relatorio-cursos-${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao fazer o download:", error);
      alert("Não foi possível gerar o relatório.");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return (
    // 1. ARQUITETURA DE LAYOUT: A página define seu próprio fundo e altura mínima.
    <div className="bg-gray-100 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      
      {/* Container principal com o fundo de "papel" */}
      <div className="max-w-7xl mx-auto bg-[#E6E3DC] rounded-xl shadow-lg p-6">
        
        {/* Header da Página */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Consultas e Relatórios</h1>
          <div className="relative" ref={optionsMenuRef}>
            <button onClick={() => setShowOptions(o => !o)} className="bg-[#699530] hover:bg-[#587e29] text-white p-2 rounded-full transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#699530]" aria-label="Ações">
              <FaPlus className="w-5 h-5" />
            </button>
            <div className={`absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl z-20 p-2 space-y-1 transition-all duration-200 ease-out origin-top-right ${showOptions ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <button onClick={() => navigate("/app/criar-modelo-relatorio")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100">Criar modelo de relatório</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button onClick={() => navigate("/app/criar-relatorio-acolhimento")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100">Criar relatório de acolhimento</button>
              <div className="border-t border-gray-200 my-1"></div>
               <button onClick={() => navigate("/app/criar-relatorio-acompanhamento")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100">Criar relatório de acompanhamento</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button onClick={handleDownloadCursos} disabled={isDownloading} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-wait">
                {isDownloading ? <FaSpinner className="animate-spin text-blue-500" /> : <FaDownload className="text-green-700" />}
                <span>{isDownloading ? 'Gerando...' : 'Download Cursos Ativos (.csv)'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Controles de Filtro e Busca */}
        <section className="mb-6 space-y-4">
          <div className="relative w-full md:max-w-sm">
            <FaSearch className="w-4 h-4 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none"/>
            <input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border rounded-md outline-none focus:ring-2 focus:ring-[#699530]" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-6 gap-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700 text-sm shrink-0">Filtrar por:</span>
              {FILTER_TYPES.map(type => (
                <button key={type} onClick={() => setActiveFilter(type)} className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${activeFilter === type ? 'bg-[#699530] text-white font-bold shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>{type}</button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700 text-sm shrink-0">Ordenar por:</span>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => setSortKey(opt.key)} className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${sortKey === opt.key ? 'bg-gray-700 text-white font-bold shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid de Conteúdo */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading && <div className="col-span-full flex justify-center p-8"><FaSpinner className="animate-spin text-4xl text-[#699530]" /></div>}
          {error && <p className="col-span-full text-center text-red-600 p-8">{error}</p>}
          {!loading && !error && sortedData.length === 0 && <p className="col-span-full text-center text-gray-600 p-8">Nenhum item encontrado.</p>}
          {!loading && !error && sortedData.map((item) => <RelatorioCard key={item.id} item={item} />)}
        </section>
      </div>
    </div>
  );
}