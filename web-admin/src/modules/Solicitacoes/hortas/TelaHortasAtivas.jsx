import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api'; 
import Header from '../../Home/components/Header'; 
import { 
  FiSearch, FiChevronDown, FiEdit3, FiLoader, FiAlertCircle, 
  FiCheckCircle, FiXCircle, FiEye, FiFilter, FiInbox, FiClock,
  FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown,
  FiMapPin // Ícone de localização adicionado
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';     

// Função formatDate removida pois não estava sendo usada

const ALL_STATUS_OPTIONS = [
  { value: 'ATIVA', label: 'Ativa', icon: <FiCheckCircle className="mr-2" />, colorClass: 'text-green-700 bg-green-100', ringClass: 'focus:ring-green-500', hoverClass: 'hover:bg-green-200' },
  { value: 'INATIVA', label: 'Inativa', icon: <FiXCircle className="mr-2" />, colorClass: 'text-red-700 bg-red-100', ringClass: 'focus:ring-red-500', hoverClass: 'hover:bg-red-200' },
  { value: 'PENDENTE', label: 'Pendente', icon: <FiClock className="mr-2" />, colorClass: 'text-yellow-700 bg-yellow-100', ringClass: 'focus:ring-yellow-500', hoverClass: 'hover:bg-yellow-200' },
  { value: 'VISITA_AGENDADA', label: 'Visita Agendada', icon: <FiClock className="mr-2" />, colorClass: 'text-blue-700 bg-blue-100', ringClass: 'focus:ring-blue-500', hoverClass: 'hover:bg-blue-200' },
];

const CHANGEABLE_STATUS_OPTIONS_FOR_MANAGEMENT = ALL_STATUS_OPTIONS.filter(opt => opt.value !== 'PENDENTE');

const getStatusDisplayProps = (statusValue) => {
  const option = ALL_STATUS_OPTIONS.find(opt => opt.value === statusValue);
  if (option) {
    return {
      label: option.label,
      icon: React.cloneElement(option.icon, { className: 'mr-1 h-3.5 w-3.5 xs:mr-1.5 xs:h-4 xs:w-4 flex-shrink-0' }), 
      className: `px-2 py-0.5 text-[10px] xs:text-xs leading-5 font-semibold rounded-full ${option.colorClass} inline-flex items-center`
    };
  }
  return {
    label: statusValue || 'Desconhecido', icon: null,
    className: 'px-2 py-0.5 text-[10px] xs:text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 inline-flex items-center'
  };
};

export default function TelaGerenciamentoHortas() { // Verifique se o nome do arquivo é este
  const navigate = useNavigate();
  const [allFetchedHortas, setAllFetchedHortas] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'nomeHorta', direction: 'ascending' });
  const [activeItemDropdownId, setActiveItemDropdownId] = useState(null); 
  const itemDropdownRef = useRef(null); 
  const [statusFilter, setStatusFilter] = useState('TODOS'); 

  const fetchAllManageableHortas = useCallback(async () => {
    const manageableStatusesForFetch = ['ATIVA', 'INATIVA', 'VISITA_AGENDADA'];
    setIsLoading(true);
    setError(null);
    let combinedHortas = [];
    let fetchError = null;
    try {
      const promises = manageableStatusesForFetch.map(status => 
        api.get(`/hortas/status/${status.toUpperCase()}`)
          .then(response => response.data || [])
          .catch(err => {
            console.error(`Erro ao buscar hortas ${status}:`, err);
            if (!fetchError) fetchError = `Falha ao carregar dados para o status ${status}.`;
            return []; 
          })
      );
      const results = await Promise.all(promises);
      results.forEach(hortasList => combinedHortas = combinedHortas.concat(hortasList));
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
  }, []); 

  useEffect(() => { fetchAllManageableHortas(); }, [fetchAllManageableHortas]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (itemDropdownRef.current && !itemDropdownRef.current.contains(event.target)) {
        setActiveItemDropdownId(null);
      }
    };
    if (activeItemDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeItemDropdownId]);

  const handleStatusChange = async (hortaId, newStatusValue) => { 
    const hortaToUpdate = allFetchedHortas.find(h => h.id === hortaId);
    if (!hortaToUpdate) return;
    const originalStatus = hortaToUpdate.status;
    setActiveItemDropdownId(null); 
    setAllFetchedHortas(prevHortas =>
      prevHortas.map(h => (h.id === hortaId ? { ...h, status: newStatusValue } : h))
    );
    try {
      await api.patch(`/hortas/${hortaId}/status?status=${newStatusValue}`); 
      const newStatusLabel = ALL_STATUS_OPTIONS.find(s => s.value === newStatusValue)?.label || newStatusValue;
      toast.success(<span>Status da horta <strong>{hortaToUpdate.nomeHorta}</strong> atualizado para <strong>{newStatusLabel}</strong>!</span>);
    } catch (err) {
      console.error("Erro ao alterar status da horta:", err);
      toast.error(<span>Falha ao atualizar status da horta <strong>{hortaToUpdate.nomeHorta}</strong>.</span>);
      setAllFetchedHortas(prevHortas =>
        prevHortas.map(h => (h.id === hortaId ? { ...h, status: originalStatus } : h))
      );
    }
  };
  
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = useCallback((id) => { 
    setExpandedId(currentId => (currentId === id ? null : id));
  }, []);

  const filteredHortas = allFetchedHortas.filter(horta => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        horta.nomeHorta.toLowerCase().includes(searchLower) || 
        (horta.endereco && horta.endereco.toLowerCase().includes(searchLower)) ||
        (horta.proprietario && horta.proprietario.toLowerCase().includes(searchLower)) ||
        (horta.status && horta.status.toLowerCase().includes(searchLower));

      if (statusFilter === 'TODOS') return matchesSearch;
      if (statusFilter === 'ATIVOS') return matchesSearch && horta.status === 'ATIVA';
      if (statusFilter === 'INATIVOS') return matchesSearch && horta.status === 'INATIVA';
      if (statusFilter === 'VISITA_AGENDADA') return matchesSearch && horta.status === 'VISITA_AGENDADA';
      return false;
    }
  );

  const sortedHortas = [...filteredHortas].sort((a, b) => { 
    if (sortConfig.key === null || a[sortConfig.key] === undefined || b[sortConfig.key] === undefined) return 0;
    let valA = a[sortConfig.key];
    let valB = b[sortConfig.key];
    if (sortConfig.key === 'status') {
      valA = ALL_STATUS_OPTIONS.findIndex(opt => opt.value === valA);
      valB = ALL_STATUS_OPTIONS.findIndex(opt => opt.value === valB);
    } else if (['dataInicio', 'dataFim', 'dataInscInicio', 'dataInscFim'].includes(sortConfig.key) ) { // Corrigido para incluir todas as datas
        valA = new Date(valA);
        valB = new Date(valB);
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }
    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
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
    { label: 'Data Início', key: 'dataInicio'} // Exemplo se quisesse ordenar por data de início
  ];

  // JSX para Loading e Error (mantido)
  if (isLoading) { /* ... */ }
  if (error && allFetchedHortas.length === 0 && !isLoading) { /* ... */ }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Header title="Gerenciamento de Hortas" />
      <ToastContainer position="bottom-right" autoClose={3500} theme="colored" />
      
      <main className="container mx-auto p-3 sm:p-4 md:p-6 pt-4 sm:pt-6">
        <header className="mb-6 p-4 sm:p-5 bg-white rounded-xl shadow-lg">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gerenciamento de Hortas</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Visualize e gerencie o status das hortas (Ativas, Inativas, Visitas Agendadas).</p>
        </header>

        <section className="mb-6 p-4 bg-white rounded-xl shadow-lg">
          <div className="space-y-4"> 
            <div className="relative">
              <label htmlFor="search-hortas" className="sr-only">Buscar hortas</label>
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="search-hortas" type="text" placeholder="Buscar por nome, endereço, proprietário ou status..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="w-full">
                <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-0.5">Filtrar Status:</label>
                <select
                  id="status-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-green-500"
                >
                  <option value="TODOS">Todos</option>
                  <option value="ATIVOS">Somente Ativos</option>
                  <option value="INATIVOS">Somente Inativos</option>
                  <option value="VISITA_AGENDADA">Visita Agendada</option>
                </select>
              </div>

              <div className="w-full">
                <label htmlFor="sort-by" className="block text-xs font-medium text-gray-700 mb-0.5">Ordenar por:</label>
                <select
                  id="sort-by" value={sortConfig.key} onChange={(e) => requestSort(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-1 focus:ring-green-500"
                >
                  {sortOptions.map(option => (
                      <option key={option.key} value={option.key}>{option.label}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => requestSort(sortConfig.key)}
                className="w-full sm:w-auto h-10 px-3 bg-white text-gray-600 border border-gray-300 rounded-lg flex items-center justify-center gap-1 hover:bg-gray-50 text-sm"
                title={sortConfig.direction === 'ascending' ? "Mudar para Descendente" : "Mudar para Ascendente"}
              >
                {sortConfig.direction === 'ascending' ? <FiArrowUp className="w-4 h-4" /> : <FiArrowDown className="w-4 h-4" />}
                <span className="sm:hidden">
                  {sortConfig.direction === 'ascending' ? 'Cresc.' : 'Decresc.'}
                </span>
                <span className="hidden sm:inline">
                  {sortConfig.direction === 'ascending' ? 'Crescente' : 'Decrescente'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {!isLoading && sortedHortas.length > 0 ? (
          <section className="space-y-3">
            {sortedHortas.map((horta) => { 
              const currentStatusDisplay = getStatusDisplayProps(horta.status);
              return (
                <div key={horta.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200/80">
                  <div 
                    className="flex flex-col xs:flex-row items-start xs:items-center justify-between px-3 py-3 sm:px-4 cursor-pointer hover:bg-gray-50/70 rounded-t-lg"
                    onClick={() => toggleExpand(horta.id)}
                  >
                    <div className="flex-1 min-w-0 mb-2 xs:mb-0 xs:mr-2">
                      <h2 className="text-sm sm:text-base font-semibold text-green-700 truncate" title={horta.nomeHorta}>{horta.nomeHorta}</h2>
                      <p className="text-[11px] xs:text-xs text-gray-500 truncate" title={horta.endereco}>
                        <FiMapPin className="inline w-3 h-3 mr-1 text-gray-400" />{horta.endereco} {/* FiMapPin usado aqui */}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 self-start xs:self-center">
                      <div className={currentStatusDisplay.className} title={`Status: ${currentStatusDisplay.label}`}>
                        {currentStatusDisplay.icon}
                        <span className="hidden xs:inline">{currentStatusDisplay.label}</span>
                      </div>
                      <FiChevronDown className={`w-4 h-4 text-gray-400 transform transition-transform ${expandedId === horta.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {expandedId === horta.id && (
                    <div className="border-t px-3 pt-2 pb-3 sm:px-4 bg-slate-50 rounded-b-lg space-y-2 text-xs text-gray-700">
                       <p><strong className="font-medium">Proprietário:</strong> {horta.proprietario}</p>
                       <p><strong className="font-medium">Tipo da Horta:</strong> {horta.tipo || 'N/A'}</p>
                      
                      <div className="pt-2 border-t border-gray-200/60 flex flex-col xs:flex-row xs:items-center xs:justify-end gap-1.5 xs:gap-2 mt-2">
                        <div ref={el => itemDropdownRef.current = el} className="relative w-full xs:w-auto">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setActiveItemDropdownId(activeItemDropdownId === horta.id ? null : horta.id); }}
                            className="w-full xs:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-2.5 py-1 bg-white text-[10px] xs:text-xs font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Mudar Status <FiChevronDown className="ml-1 h-3.5 w-3.5" />
                          </button>
                          {activeItemDropdownId === horta.id && (
                            <div className="origin-top-right absolute right-0 mt-1 w-full xs:w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-0.5">
                                {CHANGEABLE_STATUS_OPTIONS_FOR_MANAGEMENT.filter(opt => opt.value !== horta.status).map(option => (
                                  <button
                                    key={option.value}
                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(horta.id, option.value); }}
                                    className={`group flex items-center w-full px-2.5 py-1.5 text-[10px] xs:text-xs text-left text-gray-700 ${option.hoverClass}`}
                                  >
                                    {React.cloneElement(option.icon, { className: 'mr-1.5 h-3.5 w-3.5' })}
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Link to={`/app/hortas-editar/${horta.id}`} onClick={(e) => e.stopPropagation()} className="w-full xs:w-auto flex items-center justify-center gap-1 px-2.5 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-[10px] xs:text-xs font-medium"> <FiEdit3 className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Editar</span> </Link>
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/app/hortas/visualizar/${horta.id}`); }} className="w-full xs:w-auto flex items-center justify-center gap-1 px-2.5 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-[10px] xs:text-xs font-medium"> <FiEye className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Ver</span> </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ) : (!isLoading && 
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <FiInbox className="w-16 h-16 text-gray-400 mx-auto mb-5" />
                <h3 className="text-xl font-semibold text-gray-700">Nenhuma Horta Encontrada</h3>
                <p className="text-gray-500 mt-2 text-sm">
                {searchQuery ? "Nenhuma horta corresponde à sua busca." : "Não há hortas para exibir com os filtros atuais."}
                </p>
            </div>
        )}

        {!isLoading && sortedHortas.length > 0 && ( 
            <footer className="mt-8 sm:mt-10 flex justify-center items-center space-x-1 sm:space-x-2 p-4 bg-white rounded-xl shadow-lg">
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 disabled:opacity-50 cursor-not-allowed" disabled>
                    <FiChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold text-green-600 px-3.5 py-1.5 bg-green-100 rounded-md">1</span>
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 disabled:opacity-50 cursor-not-allowed" disabled>
                     <FiChevronRight className="w-5 h-5" />
                </button>
            </footer>
        )}
      </main>
    </div>
  );
}