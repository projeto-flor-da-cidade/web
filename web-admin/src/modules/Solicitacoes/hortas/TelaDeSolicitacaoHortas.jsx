import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api'; // Ajuste o caminho se sua estrutura de pastas for diferente
import { FiCalendar, FiTag, FiSearch, FiEye, FiAlertCircle, FiLoader, FiInbox } from 'react-icons/fi'; // Ícones

export default function TelaDeSolicitacaoHortas() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/hortas/solicitacoes/pendentes');
        setRequests(response.data || []);
      } catch (err) {
        console.error("Erro ao buscar solicitações pendentes:", err);
        setError("Não foi possível carregar as solicitações. Tente novamente mais tarde.");
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const filteredAndSortedRequests = requests
    .filter(r => r.title.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      if (!sortKey) return 0;
      if (sortKey === 'date') {
        return new Date(a.date) - new Date(b.date);
      }
      return String(a[sortKey]).localeCompare(String(b[sortKey]));
    });

  const sortOptions = [
    { label: 'Data', key: 'date', icon: <FiCalendar className="mr-1 inline" /> },
    { label: 'Nome', key: 'title', icon: null }, // Ícone opcional para nome
    { label: 'Tipo', key: 'type', icon: <FiTag className="mr-1 inline" /> },
  ];

  const handleSort = (key) => {
    setSortKey(currentSortKey => (currentSortKey === key ? '' : key));
  };

  return (
    <main className="relative flex-1 bg-[#A9AD99] pt-16 p-4 md:p-6 min-h-screen">
      <div className="mx-auto w-full max-w-7xl bg-[#E6E3DC] rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="font-openSans font-bold text-3xl text-gray-800 text-center sm:text-left">
            Solicitações Pendentes de Hortas
          </h1>
          <p className="font-openSans text-gray-600 text-center sm:text-left mt-1">
            Visualize e gerencie as solicitações de novas hortas.
          </p>
        </div>

        {/* Controles: Busca e Ordenação */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          {/* Campo de busca */}
          <div className="relative flex-1 min-w-0 md:max-w-md">
            <input
              type="text"
              placeholder="Pesquisar por título ou endereço..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white font-openSans text-sm focus:outline-none focus:ring-2 focus:ring-[#6D9435] focus:border-[#6D9435] transition shadow-sm"
              aria-label="Pesquisar solicitações"
            />
            <FiSearch
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              aria-hidden="true"
            />
          </div>

          {/* Filtros de ordenação */}
          <div className="flex items-center justify-start md:justify-end space-x-2 sm:space-x-3 font-openSans text-sm flex-wrap">
            <span className="font-semibold text-gray-700 mr-2 hidden sm:inline">Ordenar por:</span>
            {sortOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => handleSort(opt.key)}
                className={`flex items-center px-3 py-1.5 rounded-md font-medium transition-all duration-150 ease-in-out whitespace-nowrap text-xs sm:text-sm shadow-sm hover:shadow-md
                  ${
                    sortKey === opt.key
                      ? 'bg-[#6D9435] text-white ring-2 ring-offset-1 ring-[#5a7a2a]'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback de Carregamento, Erro ou Lista Vazia */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FiLoader className="w-12 h-12 text-[#6D9435] animate-spin mb-4" />
            <p className="font-openSans text-lg text-gray-700">Carregando solicitações...</p>
            <p className="font-openSans text-sm text-gray-500">Por favor, aguarde um momento.</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-red-50 border-2 border-dashed border-red-200 rounded-lg p-6">
            <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="font-openSans text-lg font-semibold text-red-700">{error}</p>
            <p className="font-openSans text-sm text-red-500 mt-1">Verifique sua conexão ou tente recarregar a página.</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filteredAndSortedRequests.length > 0 ? (
              <div className="space-y-5">
                {filteredAndSortedRequests.map(req => (
                  <article
                    key={req.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center bg-white rounded-lg p-4 sm:p-5 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                  >
                    <div className="flex-1 mb-4 sm:mb-0 sm:mr-6">
                      <h2 className="font-openSans text-lg font-semibold text-gray-800 mb-2 break-words leading-tight">
                        {req.title}
                      </h2>
                      <div className="flex flex-col space-y-1.5 sm:space-y-0 sm:flex-row sm:flex-wrap sm:items-center text-xs sm:text-sm text-gray-600 font-openSans gap-x-4 gap-y-1.5">
                        <span className="flex items-center whitespace-nowrap">
                          <FiCalendar className="w-4 h-4 mr-1.5 text-gray-500" />
                          Data: <strong className="ml-1 font-medium text-gray-700">{new Date(req.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</strong>
                        </span>
                        <span className="flex items-center whitespace-nowrap">
                          <FiTag className="w-4 h-4 mr-1.5 text-gray-500" />
                          Tipo: <strong className="ml-1 font-medium text-gray-700">{req.type}</strong>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate('/app/tela-de-descricao-de-solicitacao-hortas', {
                          state: { id: req.id, source: 'solicitacoes' },
                        })
                      }
                      className="flex items-center self-start sm:self-center mt-2 sm:mt-0 px-4 py-2 bg-[#6D9435] text-white rounded-md hover:bg-[#5a7a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D9435] transition-colors duration-150 ease-in-out font-openSans font-semibold text-sm shadow-sm hover:shadow-lg whitespace-nowrap"
                      aria-label={`Visualizar detalhes de ${req.title}`}
                    >
                      <FiEye className="w-4 h-4 mr-2" />
                      Visualizar
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6">
                <FiInbox className="w-12 h-12 text-blue-500 mb-4" />
                <p className="font-openSans text-lg font-semibold text-blue-700">Nenhuma Solicitação Pendente</p>
                <p className="font-openSans text-sm text-blue-500 mt-1">Não há novas solicitações de hortas no momento.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}