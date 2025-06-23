import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api'; // Ajuste path as needed
import Header from '../../Home/components/Header'; // Assuming this component exists
import {
  FiSearch, FiEdit3, FiEye, FiChevronDown, FiLoader, FiAlertCircle, FiInbox,
  FiCheckCircle, FiXCircle, FiClock, FiMapPin, FiUser, FiFilter,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ALL_STATUS_OPTIONS = [
  { value: 'ATIVA', label: 'Ativa', icon: <FiCheckCircle className="mr-2 text-green-500" />, baseClass: 'text-green-700 bg-green-100', hoverClass: 'hover:bg-green-200' },
  { value: 'INATIVA', label: 'Inativa', icon: <FiXCircle className="mr-2 text-red-500" />, baseClass: 'text-red-700 bg-red-100', hoverClass: 'hover:bg-red-200' },
  { value: 'PENDENTE', label: 'Pendente', icon: <FiClock className="mr-2 text-yellow-500" />, baseClass: 'text-yellow-700 bg-yellow-100', hoverClass: 'hover:bg-yellow-200' },
  { value: 'VISITA_AGENDADA', label: 'Visita Agendada', icon: <FiClock className="mr-2 text-blue-500" />, baseClass: 'text-blue-700 bg-blue-100', hoverClass: 'hover:bg-blue-200' },
];

const CHANGEABLE_STATUS_OPTIONS_FOR_MANAGEMENT = ALL_STATUS_OPTIONS.filter(opt => opt.value !== 'PENDENTE');

const getStatusDisplayProps = (statusValue) => {
  const option = ALL_STATUS_OPTIONS.find(opt => opt.value === statusValue);
  if (option) {
    return {
      label: option.label,
      icon: React.cloneElement(option.icon, { className: 'mr-1.5 h-4 w-4' }), 
      className: `px-2.5 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${option.baseClass}`
    };
  }
  return {
    label: statusValue || 'Desconhecido',
    icon: null,
    className: 'px-2.5 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  };
};

export default function TelaGerenciamentoHortas() {
  const navigate = useNavigate();
  const [allFetchedHortas, setAllFetchedHortas] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'nomeHorta', direction: 'ascending' });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // manageableStatuses foi removido daqui

  const fetchAllManageableHortas = useCallback(async () => {
    // manageableStatuses agora é definido DENTRO do useCallback
    const manageableStatusesForFetch = ['ATIVA', 'INATIVA', 'VISITA_AGENDADA'];

    setIsLoading(true);
    setError(null);
    let combinedHortas = [];
    let fetchError = null;

    try {
      const promises = manageableStatusesForFetch.map(status => // Usando a variável interna
        api.get(`/hortas/status/${status.toUpperCase()}`)
          .then(response => response.data || [])
          .catch(err => {
            console.error(`Erro ao buscar hortas ${status}:`, err);
            if (!fetchError) {
              fetchError = `Falha ao carregar dados para o status ${status}.`;
            }
            return []; 
          })
      );

      const results = await Promise.all(promises);
      results.forEach(hortasList => {
        combinedHortas = combinedHortas.concat(hortasList);
      });

      const uniqueHortas = Array.from(new Set(combinedHortas.map(a => a.id)))
                            .map(id => combinedHortas.find(a => a.id === id));

      setAllFetchedHortas(uniqueHortas);
      if (fetchError) setError(fetchError); 

    } catch (generalError) { 
      console.error(`Erro geral ao buscar todas as hortas gerenciáveis:`, generalError);
      setError("Ocorreu um erro inesperado ao carregar os dados das hortas.");
      setAllFetchedHortas([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // O array de dependências agora pode ficar vazio, pois não há dependências externas estáveis

  useEffect(() => {
    fetchAllManageableHortas();
  }, [fetchAllManageableHortas]); // fetchAllManageableHortas agora é estável entre renders

  // ... (o resto do código permanece o mesmo) ...
  // (handleStatusChange, useEffect para click outside, lógica de filtro e sorteio, JSX de renderização)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (hortaId, newStatus) => {
    const hortaToUpdate = allFetchedHortas.find(h => h.id === hortaId);
    if (!hortaToUpdate) return;

    const originalStatus = hortaToUpdate.status;
    setActiveDropdown(null);

    setAllFetchedHortas(prevHortas =>
      prevHortas.map(h => (h.id === hortaId ? { ...h, status: newStatus } : h))
    );

    try {
      await api.patch(`/hortas/${hortaId}/status?status=${newStatus}`);
      const newStatusLabel = ALL_STATUS_OPTIONS.find(s => s.value === newStatus)?.label || newStatus;
      toast.success(<span>Status da horta <strong>{hortaToUpdate.nomeHorta}</strong> atualizado para <strong>{newStatusLabel}</strong>!</span>);
      
    } catch (err) {
      console.error("Erro ao alterar status da horta:", err);
      toast.error(<span>Falha ao atualizar status da horta <strong>{hortaToUpdate.nomeHorta}</strong>.</span>);
      setAllFetchedHortas(prevHortas =>
        prevHortas.map(h => (h.id === hortaId ? { ...h, status: originalStatus } : h))
      );
    }
  };
  
  const filteredHortas = allFetchedHortas.filter(horta =>
    `${horta.nomeHorta} ${horta.endereco} ${horta.proprietario} ${horta.status}`.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const sortedHortas = [...filteredHortas].sort((a, b) => {
    if (sortConfig.key === null || a[sortConfig.key] === undefined || b[sortConfig.key] === undefined) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];

    if (sortConfig.key === 'status') {
      valA = ALL_STATUS_OPTIONS.findIndex(opt => opt.value === valA);
      valB = ALL_STATUS_OPTIONS.findIndex(opt => opt.value === valB);
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (valA > valB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      setSortConfig({ key: 'nomeHorta', direction: 'ascending' }); 
      return;
    }
    setSortConfig({ key, direction });
  };

  const sortOptions = [ 
    { label: 'Nome da Horta', key: 'nomeHorta' },
    { label: 'Proprietário', key: 'proprietario' },
    { label: 'Endereço', key: 'endereco' },
    { label: 'Status', key: 'status' },
    { label: 'Tipo', key: 'tipo' },
  ];

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  if (isLoading) { 
    return (
      <div className="flex flex-col min-h-screen bg-[#F0F2EB] font-poppins">
        <Header title="Gerenciamento de Hortas" />
        <div className="flex flex-1 items-center justify-center text-center p-10">
          <FiLoader className="w-12 h-12 text-green-600 animate-spin mr-4" />
          <div>
            <p className="text-xl font-semibold text-gray-700">Carregando Hortas...</p>
            <p className="text-sm text-gray-500">Por favor, aguarde.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && allFetchedHortas.length === 0) { 
    return (
      <div className="flex flex-col min-h-screen bg-[#F0F2EB] font-poppins">
        <Header title="Gerenciamento de Hortas" />
        <div className="flex flex-1 items-center justify-center text-center p-6 m-6 bg-white rounded-xl shadow-lg">
          <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-xl font-semibold text-red-700">Erro ao Carregar Hortas</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchAllManageableHortas}
            className="mt-6 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2EB] font-poppins">
      <Header title="Gerenciamento de Hortas" /> 
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      
      <main className="flex-1 container mx-auto pt-20 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            Gerenciamento de Hortas 
          </h1>
          <p className="text-sm text-gray-600">Visualize, filtre e gerencie o status das hortas (Ativas, Inativas, Visitas Agendadas).</p> 
        </div>

        <section className="mb-8 p-5 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 min-w-0 md:max-w-md">
              <input
                type="text"
                placeholder="Buscar por nome, proprietário, endereço ou status..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
              />
              <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="flex items-center gap-2">
                <FiFilter className="text-gray-500 h-5 w-5" />
                <label htmlFor="sort-key" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Ordenar por:
                </label>
                <select
                    id="sort-key"
                    value={sortConfig.key}
                    onChange={(e) => requestSort(e.target.value)}
                    className="text-sm bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition"
                >
                    {sortOptions.map(option => (
                        <option key={option.key} value={option.key}>{option.label} {getSortIndicator(option.key)}</option>
                    ))}
                </select>
                <button 
                    onClick={() => requestSort(sortConfig.key)} 
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition text-gray-600"
                    title={sortConfig.direction === 'ascending' ? 'Ordenando Ascendente' : 'Ordenando Descendente'}
                >
                    <FiChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${sortConfig.direction === 'descending' ? 'rotate-180' : ''}`} />
                </button>
            </div>
          </div>
        </section>

        {sortedHortas.length > 0 ? (
          <div className="space-y-5">
            {sortedHortas.map((horta) => {
              const currentStatusProps = getStatusDisplayProps(horta.status);
              return (
                <article key={horta.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg sm:text-xl font-semibold text-green-700 mb-1.5 truncate" title={horta.nomeHorta}>
                          {horta.nomeHorta}
                        </h2>
                        <div className="text-xs sm:text-sm text-gray-500 mb-1 flex items-center" title={horta.endereco}>
                          <FiMapPin className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                          <span className="truncate">{horta.endereco}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 flex items-center" title={horta.proprietario}>
                          <FiUser className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
                          Proprietário: <strong className="ml-1 font-medium truncate">{horta.proprietario}</strong>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 md:items-end md:flex-col md:gap-2 mt-3 md:mt-0 w-full sm:w-auto">
                        <div ref={activeDropdown === horta.id ? dropdownRef : null} className="relative inline-block text-left w-full sm:w-auto md:min-w-[160px]">
                          <button
                            type="button"
                            className={`inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500 ${currentStatusProps.className}`}
                            onClick={() => setActiveDropdown(activeDropdown === horta.id ? null : horta.id)}
                          >
                            <span className="flex items-center">
                              {currentStatusProps.icon}
                              {currentStatusProps.label}
                            </span>
                            <FiChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                          </button>
                          {activeDropdown === horta.id && (
                            <div className="origin-top-right absolute right-0 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                              <div className="py-1">
                                {CHANGEABLE_STATUS_OPTIONS_FOR_MANAGEMENT.map(option => ( 
                                  <button
                                    key={option.value}
                                    onClick={() => handleStatusChange(horta.id, option.value)}
                                    disabled={horta.status === option.value}
                                    className={`group flex items-center w-full px-3 py-2 text-sm text-left
                                      ${horta.status === option.value ? `font-semibold ${option.baseClass}` : `text-gray-700 ${option.hoverClass}`}
                                      ${horta.status === option.value ? 'cursor-default' : 'hover:font-medium'}`}
                                  >
                                    {option.icon}
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
                            <button
                                onClick={() => navigate(`/app/hortas/editar/${horta.id}`)} 
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-1 focus:ring-blue-500 transition-colors text-xs sm:text-sm font-medium"
                                title="Editar Horta"
                            > <FiEdit3 className="w-4 h-4" /> <span className="hidden sm:inline">Editar</span>
                            </button>
                            <button
                                onClick={() => navigate(`/app/hortas/visualizar/${horta.id}`)} 
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 ring-offset-1 focus:ring-gray-600 transition-colors text-xs sm:text-sm font-medium"
                                title="Visualizar Detalhes"
                            > <FiEye className="w-4 h-4" /> <span className="hidden sm:inline">Ver</span>
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FiInbox className="w-16 h-16 text-gray-400 mx-auto mb-5" />
            <h3 className="text-xl font-semibold text-gray-700">Nenhuma Horta Encontrada</h3>
            <p className="text-gray-500 mt-2 text-sm">
              {searchQuery ? "Nenhuma horta corresponde à sua busca." : "Não há hortas para gerenciamento no momento."}
            </p>
          </div>
        )}

        {sortedHortas.length > 0 && (
            <footer className="mt-10 flex justify-center items-center space-x-1 sm:space-x-2 p-4 bg-white rounded-xl shadow-lg">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-50" disabled>
                    <FiChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-green-600 px-3.5 py-1.5 bg-green-100 rounded-md">1</span>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-50" disabled>
                     <FiChevronRight className="w-5 h-5" />
                </button>
            </footer>
        )}
      </main>
    </div>
  );
}