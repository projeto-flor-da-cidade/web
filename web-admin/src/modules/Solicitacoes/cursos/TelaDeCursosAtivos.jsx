import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api'; 

import Header from '../../Home/components/Header'; 
import { 
  FiSearch, FiChevronDown, FiEdit3, FiLoader, FiAlertCircle, 
  FiCheckCircle, FiXCircle, FiEye, FiFilter, FiInbox, FiClock,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';     

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  if (!/^\d{4}-\d{2}-\d{2}/.test(dateString)) return dateString;
  try {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    
    const day = String(localDate.getDate()).padStart(2, '0');
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    console.warn("Erro ao formatar data:", dateString, e);
    return dateString;
  }
};

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
      icon: React.cloneElement(option.icon, { className: 'mr-1.5 h-4 w-4 flex-shrink-0' }), 
      className: `px-2.5 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${option.colorClass}`
    };
  }
  return {
    label: statusValue || 'Desconhecido',
    icon: null,
    className: 'px-2.5 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  };
};

export default function TelaDeCursosAtivos() {
  const navigate = useNavigate();
  const [allCursos, setAllCursos] = useState([]); 
  
  // CORREÇÃO AQUI: Usar isLoading e setIsLoading consistentemente
  const [isLoading, setIsLoading] = useState(true); 
  
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Data'); 
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('TODOS'); 
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const dropdownRefs = useRef({}); 

  const fetchAllCursosCallback = useCallback(async () => {
    setIsLoading(true); // CORRETO
    setError(null);
    try {
      const response = await api.get('/cursos');
      setAllCursos(response.data || []);
    } catch (err) {
      setError('Não foi possível carregar os cursos. Tente novamente mais tarde.');
      toast.error('Falha ao carregar cursos.');
      console.error("Erro ao buscar cursos:", err);
    } finally {
      setIsLoading(false); // CORRETO
    }
  }, []);

  useEffect(() => {
    fetchAllCursosCallback();
  }, [fetchAllCursosCallback]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdownId && dropdownRefs.current[activeDropdownId] && !dropdownRefs.current[activeDropdownId].contains(event.target)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdownId]);


  const handleStatusChange = useCallback(async (curso, newStatusBool) => {
    const originalCursos = [...allCursos];
    setActiveDropdownId(null); 
    
    const updatedCursosOptimistic = allCursos.map(c => 
      c.idCurso === curso.idCurso ? { ...c, ativo: newStatusBool } : c
    );
    setAllCursos(updatedCursosOptimistic);

    const cursoToUpdateBackend = { 
      ...curso, 
      ativo: newStatusBool,
      dataInicio: curso.dataInicio ? curso.dataInicio.split('T')[0] : null,
      dataFim: curso.dataFim ? curso.dataFim.split('T')[0] : null,
      dataInscInicio: curso.dataInscInicio ? curso.dataInscInicio.split('T')[0] : null,
      dataInscFim: curso.dataInscFim ? curso.dataInscFim.split('T')[0] : null,
    };
    
    const formData = new FormData();
    formData.append('curso', new Blob([JSON.stringify(cursoToUpdateBackend)], { type: 'application/json' }));
    
    try {
      await api.put(`/cursos/${curso.idCurso}`, formData);
      toast.success(`Status de "${curso.nome}" atualizado para ${newStatusBool ? 'Ativo' : 'Inativo'}!`);
    } catch (err) {
      console.error("Falha ao atualizar o status:", err);
      toast.error(`Falha ao atualizar status de "${curso.nome}".`);
      setAllCursos(originalCursos); 
    }
  }, [allCursos]);

  const toggleExpand = useCallback((id) => {
    setExpandedId(currentId => (currentId === id ? null : id));
  }, []);

  const filteredAndSortedCursos = allCursos
    .filter(c => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        c.nome.toLowerCase().includes(searchLower) ||
        (c.instituicao && c.instituicao.toLowerCase().includes(searchLower)) ||
        (c.tipoAtividade && c.tipoAtividade.toLowerCase().includes(searchLower));

      if (statusFilter === 'TODOS') return matchesSearch;
      if (statusFilter === 'ATIVOS') return matchesSearch && c.ativo === true;
      if (statusFilter === 'INATIVOS') return matchesSearch && c.ativo === false;
      return false;
    })
    .sort((a, b) => {
      if (sortBy === 'Nome') return a.nome.localeCompare(b.nome);
      if (sortBy === 'Status') return (b.ativo === a.ativo) ? 0 : b.ativo ? -1 : 1; 
      if (sortBy === 'Data') {
        return new Date(b.dataInicio) - new Date(a.dataInicio);
      }
      return 0;
    });

  // CORREÇÃO AQUI: Usar isLoading consistentemente
  if (isLoading) { 
    return (
      <div className="flex flex-col min-h-screen bg-[#F0F2EB] font-poppins">
        <Header title="Gerenciamento de Cursos" />
        <div className="flex flex-1 items-center justify-center text-center p-10">
          <FiLoader className="w-12 h-12 text-green-600 animate-spin mr-4" />
          <div>
            <p className="text-xl font-semibold text-gray-700">Carregando Cursos...</p>
            <p className="text-sm text-gray-500">Por favor, aguarde.</p>
          </div>
        </div>
      </div>
    );
  }

  // CORREÇÃO AQUI (se você tivesse um if (error && !isLoading)): Usar isLoading
  if (error && allCursos.length === 0 && !isLoading) { 
    return (
      <div className="flex flex-col min-h-screen bg-[#F0F2EB] font-poppins">
        <Header title="Gerenciamento de Cursos" />
        <div className="flex flex-1 items-center justify-center text-center p-6 m-6 bg-white rounded-xl shadow-lg">
          <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-xl font-semibold text-red-700">Erro ao Carregar Cursos</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchAllCursosCallback}
            className="mt-6 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Header title="Gerenciamento de Cursos" />
      <ToastContainer position="bottom-right" autoClose={3500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-6 sm:pt-8">
        <header className="mb-6 sm:mb-8 p-5 sm:p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gerenciamento de Cursos</h1>
            <p className="text-sm text-gray-600 mt-1">Visualize e gerencie todos os cursos registrados no sistema.</p>
        </header>

        <section className="mb-6 sm:mb-8 p-5 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-grow lg:max-w-md">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por nome, instituição, tipo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <FiFilter className="text-gray-500 w-5 h-5 flex-shrink-0" />
                <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="h-10 px-3 py-0 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm shadow-sm w-full"
                >
                  <option value="TODOS">Todos</option>
                  <option value="ATIVOS">Somente Ativos</option>
                  <option value="INATIVOS">Somente Inativos</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 whitespace-nowrap">Ordenar por:</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="h-10 px-3 py-0 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm shadow-sm w-full"
                >
                  <option value="Data">Data de Início</option>
                  <option value="Nome">Nome</option>
                  <option value="Status">Status</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* CORREÇÃO AQUI (se você tivesse um if (!isLoading && ...)): Usar isLoading */}
        {!isLoading && filteredAndSortedCursos.length > 0 ? ( 
          <section className="space-y-4 sm:space-y-5">
            {filteredAndSortedCursos.map(curso => {
              const currentStatusDisplay = getStatusDisplayProps(curso.ativo ? 'ATIVA' : 'INATIVA');
              return (
                <div key={curso.idCurso} className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div 
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-left px-4 py-3 sm:px-5 sm:py-4 cursor-pointer hover:bg-gray-50 rounded-t-xl transition-colors"
                    onClick={() => toggleExpand(curso.idCurso)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleExpand(curso.idCurso)}
                    aria-expanded={expandedId === curso.idCurso}
                    aria-controls={`details-${curso.idCurso}`}
                  >
                    <div className="flex-grow mb-2 sm:mb-0 pr-2">
                      <h2 className="text-md sm:text-lg font-semibold text-green-700">{curso.nome}</h2>
                      <p className="text-xs text-gray-500">{curso.tipoAtividade} - {curso.instituicao}</p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 self-start sm:self-center">
                      <div className={currentStatusDisplay.className} title={`Status: ${currentStatusDisplay.label}`}>
                        {currentStatusDisplay.icon}
                        <span className="hidden sm:inline">{currentStatusDisplay.label}</span>
                      </div>
                      <FiChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${expandedId === curso.idCurso ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {expandedId === curso.idCurso && (
                    <div id={`details-${curso.idCurso}`} className="border-t border-gray-200 px-4 pt-3 pb-4 sm:px-5 sm:pt-4 sm:pb-5 bg-gray-50/50 rounded-b-xl space-y-3 text-gray-700 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                        <div><span className="font-medium">Período:</span> {formatDate(curso.dataInicio)} a {formatDate(curso.dataFim)}</div>
                        <div><span className="font-medium">Inscrições:</span> {formatDate(curso.dataInscInicio)} a {formatDate(curso.dataInscFim)}</div>
                        <div><span className="font-medium">Local:</span> {curso.local}</div>
                        <div><span className="font-medium">Vagas:</span> {curso.maxPessoas}</div>
                        <div><span className="font-medium">Carga Horária:</span> {curso.cargaHoraria}h</div>
                        <div><span className="font-medium">Público:</span> {curso.publicoAlvo.replace(/_/g, ' ')}</div>
                        <div className="sm:col-span-2 md:col-span-3"><span className="font-medium">Turno:</span> {curso.turno}</div>
                      </div>
                      <p className="mt-2 pt-2 border-t border-gray-200"><span className="font-medium">Descrição:</span> {curso.descricao}</p>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
                        <div ref={el => dropdownRefs.current[curso.idCurso] = el} className="relative inline-block text-left w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === curso.idCurso ? null : curso.idCurso); }}
                            className="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-3 py-1.5 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
                          >
                            Mudar Status
                            <FiChevronDown className="-mr-1 ml-1.5 h-4 w-4" />
                          </button>
                          {activeDropdownId === curso.idCurso && (
                            <div className="origin-top-right absolute right-0 sm:left-0 mt-1 w-full sm:w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                              <div className="py-1">
                                {CHANGEABLE_STATUS_OPTIONS_FOR_MANAGEMENT.filter(opt => opt.value !== (curso.ativo ? 'ATIVA' : 'INATIVA')).map(option => (
                                  <button
                                    key={option.value}
                                    onClick={(e) => { e.stopPropagation(); handleStatusChange(curso, option.value === 'ATIVA'); }}
                                    className={`group flex items-center w-full px-3 py-2 text-xs text-left text-gray-700 ${option.hoverClass}`}
                                  >
                                    {React.cloneElement(option.icon, { className: 'mr-2 h-4 w-4' })}
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/app/tela-de-edicao-de-cursos/${curso.idCurso}`}
                          onClick={(e) => e.stopPropagation()} 
                          className="flex w-full sm:w-auto items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 ring-offset-1 focus:ring-blue-500 transition-colors text-xs font-medium"
                        > <FiEdit3 className="w-4 h-4" /> Editar
                        </Link>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/app/tela-de-inscritos/${curso.idCurso}`); }} 
                          className="flex w-full sm:w-auto items-center justify-center gap-2 px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 ring-offset-1 focus:ring-gray-500 transition-colors text-xs font-medium"
                        > <FiEye className="w-4 h-4" /> Ver Detalhes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ) : (
          // CORREÇÃO AQUI (se você tivesse um if (!isLoading && ...)): Usar isLoading
          !isLoading && <div className="text-center py-16 bg-white rounded-xl shadow-lg"> 
            <FiInbox className="w-16 h-16 text-gray-400 mx-auto mb-5" />
            <h3 className="text-xl font-semibold text-gray-700">Nenhum Curso Encontrado</h3>
            <p className="text-gray-500 mt-2 text-sm">
              {search ? "Nenhum curso corresponde à sua busca." : "Não há cursos para exibir com os filtros atuais."}
            </p>
          </div>
        )}

        {/* CORREÇÃO AQUI (se você tivesse um if (!isLoading && ...)): Usar isLoading */}
        {!isLoading && filteredAndSortedCursos.length > 0 && ( 
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