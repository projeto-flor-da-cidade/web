// src/modules/relatorios/TelaDeRelatorios.jsx

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { FaPlus, FaEdit, FaDownload, FaSpinner, FaSearch, FaLeaf, FaChalkboardTeacher } from "react-icons/fa"; // Adicionado FaLeaf e FaChalkboardTeacher
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useClickOutside } from "../../hooks/useClickOutside";
import { toast, ToastContainer } from 'react-toastify'; // Importar toast
import 'react-toastify/dist/ReactToastify.css'; // Importar CSS do toast

// --- UTILITIES E CONSTANTES ---

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  // Se a data já é UTC (ex: string ISO 'YYYY-MM-DDTHH:mm:ss.sssZ'), o new Date() já a interpreta corretamente.
  // Se for uma string sem info de fuso (ex: 'YYYY-MM-DD'), pode ser interpretada como local.
  // Para consistência, especialmente se as datas do backend não têm fuso,
  // podemos forçar a interpretação como se fossem datas locais e formatar.
  // O mais seguro é o backend enviar strings ISO com fuso (Z ou offset).
  // Assumindo que as datas são para exibição simples no fuso do usuário:
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

// ATUALIZADO: Adicionado "Horta"
const FILTER_TYPES = ["Todos", "Curso", "Oficina", "Horta", "Modelo"];
const SORT_OPTIONS = [
  { label: "Data Recente", key: "data" },
  { label: "Nome (A-Z)", key: "nome" },
];

// --- SUB-COMPONENTES ---

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'Ativo': 'bg-green-100 text-green-700',        // Para Cursos
    'Disponível': 'bg-blue-100 text-blue-700',     // Para Modelos
    'Desativado': 'bg-gray-100 text-gray-700',     // Para Cursos
    'ATIVA': 'bg-green-100 text-green-700',         // Para Hortas (Enum ATIVA)
    'PENDENTE': 'bg-yellow-100 text-yellow-700',    // Para Hortas (Enum PENDENTE)
    'INATIVA': 'bg-red-100 text-red-700',         // Para Hortas (Enum INATIVA)
    'VISITA_AGENDADA': 'bg-sky-100 text-sky-700', // Para Hortas (Enum VISITA_AGENDADA)
  };
  const statusText = typeof status === 'string' ? status.replace(/_/g, ' ') : (status || "—");

  return (
    <span className={`font-medium px-2.5 py-1 rounded-full text-xs capitalize ${statusStyles[status] || 'bg-purple-100 text-purple-800'}`}>
      {statusText}
    </span>
  );
};

const RelatorioCard = ({ item }) => {
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    let path;
    if (item.isCurso) {
      path = `/app/tela-de-edicao-de-cursos/${item.id}`;
    } else if (item.tipo === "Horta") {
      path = `/app/tela-de-descricao-de-solicitacao-hortas/${item.id}`; // Leva para descrição, de lá pode editar
    } else { // Assume Modelo de Relatório
      path = `/app/editar-relatorio/${item.id}`; // Ajuste se o path for diferente
    }
    navigate(path);
  };

  const IconComponent = item.isCurso ? FaChalkboardTeacher : (item.tipo === "Horta" ? FaLeaf : FaEdit);
  const iconColor = item.isCurso ? "text-indigo-500" : (item.tipo === "Horta" ? "text-green-500" : "text-blue-500");

  return (
    <div className="flex flex-col justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div>
        <div className="flex items-center mb-2">
          <IconComponent className={`w-5 h-5 mr-2.5 ${iconColor}`} />
          <p className="font-semibold text-gray-800 break-words leading-tight text-base" title={item.nome}>{item.nome}</p>
        </div>
        <p className="text-gray-500 text-xs mb-1">
            {item.tipo} – {formatDate(item.data)}
        </p>
        <div className="text-gray-600 text-sm mt-2 flex items-center gap-1.5">
          <span className="text-xs font-medium">Status:</span>
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
        <button 
          onClick={handleNavigation} 
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" 
          aria-label={`Ver/Editar ${item.nome}`}
        >
          <FaEdit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---

export default function TelaDeRelatorios() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  
  // Estados de download específicos
  const [isDownloadingCursos, setIsDownloadingCursos] = useState(false);
  const [isDownloadingHortas, setIsDownloadingHortas] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("data");
  const [activeFilter, setActiveFilter] = useState("Todos");
  
  const optionsMenuRef = useRef(null);
  useClickOutside(optionsMenuRef, () => setShowOptions(false));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Limpa erros anteriores
      try {
        const [cursosResponse, hortasResponse] = await Promise.allSettled([
          api.get('/cursos'),
          api.get('/hortas') // Busca todas as hortas
        ]);

        let combinedData = [];
        let fetchError = false;

        if (cursosResponse.status === 'fulfilled' && cursosResponse.value.data) {
          const cursosData = cursosResponse.value.data.map(c => ({
            id: c.idCurso, 
            nome: c.nome, 
            tipo: c.tipoAtividade || "Curso", // Usa tipoAtividade, ou "Curso" como fallback
            data: c.dataInicio, // Usar dataCriacao ou dataInicio?
            status: c.ativo ? 'Ativo' : 'Desativado', 
            isCurso: true,
          }));
          combinedData = [...combinedData, ...cursosData];
        } else {
          console.error("Erro ao buscar cursos:", cursosResponse.reason);
          toast.error("Falha ao carregar dados dos cursos.");
          fetchError = true;
        }
        
        if (hortasResponse.status === 'fulfilled' && hortasResponse.value.data) {
          const hortasData = hortasResponse.value.data.map(h => ({
            id: h.idHorta,
            nome: h.nomeHorta,
            tipo: "Horta", // Tipo fixo para filtro
            data: h.dataCriacao, // Usar dataCriacao para ordenação
            status: h.statusHorta, // O StatusBadge já lida com os enums
            isCurso: false,
          }));
          combinedData = [...combinedData, ...hortasData];
        } else {
          console.error("Erro ao buscar hortas:", hortasResponse.reason);
          toast.error("Falha ao carregar dados das hortas.");
          fetchError = true;
        }
        
        // Dados mockados para Modelos (substituir por API)
        const modelosData = [
          { id: 'modelo-1', nome: "Modelo - Horta Acompanhamento", tipo: "Modelo", data: "2024-01-15", status: "Disponível", isCurso: false },
        ];
        combinedData = [...combinedData, ...modelosData];

        setData(combinedData);
        if (fetchError) {
            setError("Alguns dados podem não ter sido carregados. Verifique o console.");
        } else {
            setError(null);
        }

      } catch (err) { // Erro geral da Promise.allSettled ou outro erro inesperado
        setError("Não foi possível carregar os dados. Verifique a conexão e os endpoints da API.");
        toast.error("Erro geral ao carregar dados.");
        console.error("Erro geral em fetchData:", err);
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
      if (!a.data || !b.data) return 0; // Lida com datas nulas/undefined
      if (sortKey === "data") return new Date(b.data) - new Date(a.data);
      if (sortKey === "nome") return a.nome.localeCompare(b.nome);
      return 0;
    });
  }, [sortKey, filteredData]);

  // Função genérica de download
  const handleDownload = useCallback(async (url, defaultFilename, setIsDownloadingState) => {
    setIsDownloadingState(true);
    setShowOptions(false); // Fecha o menu
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      
      let filename = defaultFilename;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
          if (filenameMatch && filenameMatch.length > 1) { // Checa se filenameMatch[1] existe
              filename = filenameMatch[1];
          }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success(`Download de "${filename}" iniciado!`);
    } catch (error) {
      console.error(`Erro ao fazer o download de ${defaultFilename}:`, error);
      toast.error(`Não foi possível gerar o relatório: ${defaultFilename}. Verifique o console.`);
    } finally {
      setIsDownloadingState(false);
    }
  }, []);

  const handleDownloadCursos = useCallback(() => {
    const date = new Date().toISOString().slice(0, 10);
    handleDownload('/cursos/download', `relatorio-cursos-ativos-${date}.xlsx`, setIsDownloadingCursos);
  }, [handleDownload]);

  const handleDownloadTodasHortas = useCallback(() => {
    const date = new Date().toISOString().slice(0, 10);
    handleDownload('/hortas/download', `relatorio-todas-hortas-${date}.xlsx`, setIsDownloadingHortas);
  }, [handleDownload]);


  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <ToastContainer position="top-center" autoClose={4000} theme="colored" />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Consultas e Relatórios</h1>
          <div className="relative" ref={optionsMenuRef}>
            <button onClick={() => setShowOptions(o => !o)} className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-full transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" aria-label="Ações">
              <FaPlus className="w-5 h-5" />
            </button>
            <div className={`absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-2xl z-20 p-2 space-y-1 transition-all duration-200 ease-out origin-top-right ${showOptions ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <button onClick={() => navigate("/app/criar-modelo-relatorio")} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 rounded hover:bg-gray-100">Criar modelo de relatório</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button onClick={() => navigate("/app/criar-relatorio-acolhimento")} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 rounded hover:bg-gray-100">Criar relatório de acolhimento</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button onClick={() => navigate("/app/criar-relatorio-acompanhamento")} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 rounded hover:bg-gray-100">Criar relatório de acompanhamento</button>
              <div className="border-t border-gray-200 my-1"></div>
              <button onClick={handleDownloadCursos} disabled={isDownloadingCursos} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-wait">
                {isDownloadingCursos ? <FaSpinner className="animate-spin text-blue-500" /> : <FaDownload className="text-green-600" />}
                <span>{isDownloadingCursos ? 'Gerando...' : 'Cursos Ativos (.xlsx)'}</span>
              </button>
              {/* Botão de Download para Todas as Hortas */}
              <button onClick={handleDownloadTodasHortas} disabled={isDownloadingHortas} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-wait">
                {isDownloadingHortas ? <FaSpinner className="animate-spin text-blue-500" /> : <FaDownload className="text-green-600" />}
                <span>{isDownloadingHortas ? 'Gerando...' : 'Todas as Hortas (.xlsx)'}</span>
              </button>
            </div>
          </div>
        </header>

        <section className="mb-6 space-y-4">
          <div className="relative w-full md:max-w-md">
            <FaSearch className="w-4 h-4 text-gray-400 absolute top-1/2 left-3.5 -translate-y-1/2 pointer-events-none"/>
            <input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm" />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-6 gap-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700 text-sm shrink-0">Filtrar por:</span>
              {FILTER_TYPES.map(type => (
                <button key={type} onClick={() => setActiveFilter(type)} className={`px-3.5 py-1.5 text-sm rounded-full transition-colors duration-200 border ${activeFilter === type ? 'bg-green-600 text-white font-semibold shadow-md border-green-700' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-gray-400'}`}>{type}</button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700 text-sm shrink-0">Ordenar por:</span>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => setSortKey(opt.key)} className={`px-3.5 py-1.5 text-sm rounded-full transition-colors duration-200 border ${sortKey === opt.key ? 'bg-gray-700 text-white font-semibold shadow-md border-gray-800' : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 hover:border-gray-400'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading && <div className="col-span-full flex justify-center items-center p-10"><FaSpinner className="animate-spin text-5xl text-green-600" /><p className="ml-4 text-lg text-gray-600">Carregando dados...</p></div>}
          {error && !loading && <p className="col-span-full text-center text-red-600 bg-red-50 p-8 rounded-lg border border-red-200">{error}</p>}
          {!loading && !error && sortedData.length === 0 && <p className="col-span-full text-center text-gray-500 p-10 text-lg">Nenhum item encontrado com os filtros aplicados.</p>}
          {!loading && !error && sortedData.map((item) => <RelatorioCard key={`${item.tipo}-${item.id}`} item={item} />)}
        </section>
      </div>
    </div>
  );
}