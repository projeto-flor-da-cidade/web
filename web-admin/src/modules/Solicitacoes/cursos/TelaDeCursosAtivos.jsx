import React, { useState, useEffect, useCallback } from 'react';
// CORREÇÃO: Removido 'useNavigate' pois não é mais utilizado.
import { Link } from 'react-router-dom';
import axios from 'axios';

// Componentes e Ícones
import Header from '../../Home/components/Header';
import { FiSearch, FiChevronDown, FiEdit3, FiLoader, FiAlertCircle } from 'react-icons/fi';

const API_URL = 'http://localhost:8080/api/cursos';

// Função utilitária para formatar datas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const TelaDeCursosAtivos = () => {
  // CORREÇÃO: A linha 'const navigate = useNavigate();' foi removida.

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Data');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setCursos(response.data);
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar os cursos. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  const handleStatusChange = useCallback(async (curso, newStatus) => {
    const originalCursos = [...cursos];
    const updatedCursos = cursos.map(c => 
      c.idCurso === curso.idCurso ? { ...c, ativo: newStatus } : c
    );
    setCursos(updatedCursos);

    const cursoToUpdate = { ...curso, ativo: newStatus };
    
    const formData = new FormData();
    formData.append('curso', new Blob([JSON.stringify(cursoToUpdate)], { type: 'application/json' }));
    
    try {
      await axios.put(`${API_URL}/${curso.idCurso}`, formData);
    } catch (err) {
      console.error("Falha ao atualizar o status:", err);
      setCursos(originalCursos);
      alert('Não foi possível atualizar o status. Verifique sua conexão.');
    }
  }, [cursos]);

  const toggleExpand = useCallback((id) => {
    setExpandedId(currentId => (currentId === id ? null : id));
  }, []);

  const filteredCursos = cursos
    .filter(c => c.nome.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Nome') return a.nome.localeCompare(b.nome);
      if (sortBy === 'Status') return (b.ativo - a.ativo);
      return new Date(b.dataInicio) - new Date(a.dataInicio);
    });

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center p-10"><FiLoader className="animate-spin text-4xl text-green-600" /></div>;
    }
    if (error) {
      return <div className="flex flex-col items-center p-10 text-red-500"><FiAlertCircle className="text-4xl mb-2" /><span>{error}</span></div>;
    }
    if (filteredCursos.length === 0) {
      return <div className="text-center p-10 text-gray-500">Nenhum curso encontrado.</div>;
    }
    return (
      <section className="space-y-4">
        {filteredCursos.map(curso => (
          <div key={curso.idCurso} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <button
              className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center text-left px-6 py-4 hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(curso.idCurso)}
            >
              <span className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">{curso.nome}</span>
              <div className="flex items-center space-x-4">
                <select
                  value={curso.ativo}
                  onChange={(e) => handleStatusChange(curso, e.target.value === 'true')}
                  onClick={(e) => e.stopPropagation()}
                  className={`px-3 py-1 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${curso.ativo ? 'bg-green-100 text-green-800 focus:ring-green-500' : 'bg-red-100 text-red-800 focus:ring-red-500'}`}
                >
                  <option value={true}>Ativo</option>
                  <option value={false}>Desativado</option>
                </select>
                <FiChevronDown className={`w-6 h-6 text-gray-500 transform transition-transform ${expandedId === curso.idCurso ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {expandedId === curso.idCurso && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-3 text-gray-600">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">Período do Curso:</span>
                    <span>{formatDate(curso.dataInicio)} até {formatDate(curso.dataFim)}</span>
                  </div>
                  <Link
                    to={`/app/tela-de-edicao-de-cursos/${curso.idCurso}`}
                    className="mt-4 sm:mt-0 p-2 rounded-full text-gray-600 hover:bg-green-100 hover:text-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`Editar curso ${curso.nome}`}
                  >
                    <FiEdit3 className="w-5 h-5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <span><span className="font-medium">Instituição:</span> {curso.instituicao}</span>
                  <span><span className="font-medium">Vagas:</span> {curso.maxPessoas}</span>
                  <span><span className="font-medium">Inscrições:</span> {formatDate(curso.dataInscInicio)} até {formatDate(curso.dataInscFim)}</span>
                  <span><span className="font-medium">Carga Horária:</span> {curso.cargaHoraria}h</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <div className="sticky top-0 z-30"><Header /></div>
      <main className="container mx-auto p-4 md:p-6 pt-24">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Gerenciar Cursos</h1>
        <section className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="relative flex-grow md:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome do curso..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sort-by" className="text-gray-600">Ordenar por:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Data</option>
              <option>Nome</option>
              <option>Status</option>
            </select>
          </div>
        </section>
        {renderContent()}
      </main>
    </div>
  );
};

export default TelaDeCursosAtivos;