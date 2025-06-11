import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { FaPlus, FaEdit, FaEye, FaDownload, FaSpinner, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useClickOutside } from "../hooks/useClickOutside";

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return new Intl.DateTimeFormat('pt-BR').format(utcDate);
};

const FILTER_TYPES = ["Todos", "Curso", "Oficina", "Modelo"];
const SORT_OPTIONS = [
  { label: "Data", key: "data" },
  { label: "Nome", key: "nome" },
  { label: "Tipo", key: "tipo" },
];

export default function TelaDeRelatorios() {
  const navigate = useNavigate();

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
        const cursosResponse = await axios.get('http://localhost:8082/api/cursos');
        const cursosData = cursosResponse.data.map(c => ({
          id: c.idCurso, nome: c.nome, tipo: c.tipoAtividade, data: c.dataInicio,
          status: c.ativo ? 'Ativo' : 'Desativado', isCurso: true,
        }));
        
        const modelosData = [
          { id: 'modelo-1', nome: "Modelo - Horta Acompanhamento", tipo: "Modelo", data: "2024-01-01", status: "Disponível", isCurso: false },
        ];

        setData([...cursosData, ...modelosData]);
        setError(null);
      } catch (err) {
        setError("Não foi possível carregar os dados.");
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
      items = items.filter(item =>
        Object.values(item).some(val => String(val).toLowerCase().includes(term))
      );
    }
    return items;
  }, [data, activeFilter, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortKey === "data") return new Date(b.data) - new Date(a.data);
      if (!a[sortKey]) return 1; if (!b[sortKey]) return -1;
      return a[sortKey].toString().toLowerCase().localeCompare(b[sortKey].toString().toLowerCase());
    });
  }, [sortKey, filteredData]);

  const handleDownloadCursos = useCallback(async () => {
    setIsDownloading(true);
    setShowOptions(false);
    try {
      const response = await axios.get('http://localhost:8082/api/cursos/download', {
        responseType: 'blob',
      });
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
      alert("Não foi possível gerar o relatório. Verifique a conexão e a configuração de CORS no backend.");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // CORREÇÃO: Função para renderizar o conteúdo, usando os estados de loading e error.
  const renderContent = () => {
    if (loading) {
      return <div className="col-span-full flex justify-center p-8"><FaSpinner className="animate-spin text-4xl text-[#699530]" /></div>;
    }
    if (error) {
      return <p className="col-span-full text-center text-red-600 p-8">{error}</p>;
    }
    if (sortedData.length === 0) {
      return <p className="col-span-full text-center text-gray-600 p-8">Nenhum item encontrado para os filtros selecionados.</p>;
    }
    return sortedData.map((item) => (
      <div key={item.id} className="flex flex-col justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div>
          <p className="font-semibold text-gray-800 break-words">{item.nome}</p>
          <p className="text-gray-500 text-sm mt-1">{item.tipo} – {formatDate(item.data)}</p>
          <p className="text-gray-600 text-sm mt-2">Status: <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${item.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{item.status || "—"}</span></p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {item.isCurso ? (
            <Link to={`/app/tela-de-edicao-de-cursos/${item.id}`} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full" aria-label={`Editar ${item.nome}`}><FaEdit className="w-4 h-4 text-gray-600" /></Link>
          ) : (
            <button onClick={() => navigate(`/app/editar-relatorio/${item.id}`)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full" aria-label={`Editar ${item.nome}`}><FaEdit className="w-4 h-4 text-gray-600" /></button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#A9AF93] p-4 sm:p-6 lg:p-8 font-poppins">
      <div className="max-w-7xl mx-auto bg-[#E6E3DC] rounded-xl shadow-2xl p-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-semibold text-gray-800">Consultas e Relatórios</h1>
          <div className="relative" ref={optionsMenuRef}>
            <button onClick={() => setShowOptions(o => !o)} className="bg-[#699530] hover:bg-[#587e29] text-white p-2 rounded-full transition shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#699530]" aria-label="Ações">
              <FaPlus className="w-4 h-4" />
            </button>
            {/* CORREÇÃO: Menu agora usa 'showOptions' para controlar a visibilidade */}
            <div className={`absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl z-20 p-2 space-y-1 transition-all duration-200 ease-out origin-top-right ${showOptions ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <button onClick={() => navigate("/app/criar-relatorio-acolhimento")} className="block w-full text-left px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100">Criar relatório de acolhimento</button>
              <div className="border-t border-gray-200 my-1"></div>
              {/* CORREÇÃO: Botão de download agora usa 'isDownloading' e 'handleDownloadCursos' */}
              <button onClick={handleDownloadCursos} disabled={isDownloading} className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-wait">
                {isDownloading ? <FaSpinner className="animate-spin text-blue-500" /> : <FaDownload className="text-green-700" />}
                <span>{isDownloading ? 'Gerando...' : 'Download Cursos Ativos (.csv)'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative w-full md:max-w-sm">
            <input type="text" placeholder="Buscar em todos os itens..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 border rounded-md outline-none focus:ring-2 focus:ring-[#699530]" />
            <div className="absolute top-0 left-0 h-full flex items-center pl-3 pointer-events-none"><FaSearch className="w-4 h-4 text-gray-400"/></div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700 text-sm">Filtrar por:</span>
              {FILTER_TYPES.map(type => (
                <button key={type} onClick={() => setActiveFilter(type)} className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${activeFilter === type ? 'bg-[#699530] text-white font-bold shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>{type}</button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-700 text-sm">Ordenar por:</span>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.key} onClick={() => setSortKey(opt.key)} className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${sortKey === opt.key ? 'bg-[#5a6e42] text-white font-bold' : 'bg-white text-gray-700 hover:bg-gray-200'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}