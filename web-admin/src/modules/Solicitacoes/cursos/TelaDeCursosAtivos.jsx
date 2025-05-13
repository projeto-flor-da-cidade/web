import React, { useState } from 'react';
import Header from '../../Home/components/Header';
import SearchIcon from '../../../assets/search-circle-outline.svg';
import ChevronDown from '../../../assets/chevron-down-outline.svg';
import PencilIcon from '../../../assets/pencil-outline.svg';

const initialCursos = [
  { id: 1, name: 'Viva Raiz (FICTÍCIO)', period: '01/01/2025 até 31/01/2025', total: 25, max: 40, instituicao: 'SEAU', status: 'Online' },
  { id: 2, name: 'Cultiva Recife (FICTÍCIO)', period: '10/02/2025 até 28/02/2025', total: 12, max: 30, instituicao: 'SEAU', status: 'Desativado' },
  { id: 3, name: 'Brotar Coletivo (FICTÍCIO)', period: '05/03/2025 até 20/03/2025', total: 30, max: 50, instituicao: 'SEAU', status: 'Presencial' },
  { id: 4, name: 'Verdejando Cidades (FICTÍCIO)', period: '15/04/2025 até 30/04/2025', total: 8, max: 20, instituicao: 'SEAU', status: 'Híbrido' },
];

const STATUS_OPTIONS = ['Online', 'Presencial', 'Híbrido', 'Desativado'];

const TelaDeCursosAtivos = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Data');
  const [expandedId, setExpandedId] = useState(null);
  const [cursos, setCursos] = useState(initialCursos);

  const filtered = cursos
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Data') return a.period.localeCompare(b.period);
      if (sortBy === 'Nome') return a.name.localeCompare(b.name);
      if (sortBy === 'Tipo') return a.status.localeCompare(b.status);
      return 0;
    });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatusChange = (id, newStatus) => {
    setCursos(cursos.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleBack = () => window.history.back();

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <main className="container mx-auto p-6 pt-20">
        {/* Título */}
        <h1 className="text-[32.6px] font-semibold mb-6">Cursos ativos</h1>

        {/* Busca e Ordenar */}
        <section className="flex flex-col md:flex-row md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center w-full md:w-1/2 border rounded-md px-4 h-12">
            <input
              type="text"
              placeholder="Buscar curso"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full focus:outline-none"
            />
            <img src={SearchIcon} alt="Buscar" className="w-8 h-8 ml-2" />
          </div>
          <div>
            <span className="text-[22.5px] underline cursor-pointer">Ordenar por</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="ml-2 border-b-2 border-gray-500 focus:outline-none transition-colors duration-200 hover:border-gray-700"
            >
              <option>Data</option>
              <option>Nome</option>
              <option>Tipo</option>
            </select>
          </div>
        </section>

        {/* Lista de cursos */}
        <section className="space-y-4">
          {filtered.map(curso => (
            <div key={curso.id} className="bg-white border rounded-md hover:shadow-md transition-shadow duration-200">
              <button
                className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleExpand(curso.id)}
              >
                <span className="text-[26px] font-medium">{curso.name}</span>
                <div className="flex items-center space-x-4">
                  <select
                    value={curso.status}
                    onChange={e => handleStatusChange(curso.id, e.target.value)}
                    className="text-base border-none focus:outline-none bg-transparent cursor-pointer flex items-center"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <img src={ChevronDown} alt="Expandir" className={`w-6 h-6 transform ${expandedId === curso.id ? 'rotate-180' : ''} transition-transform duration-200`} />
                </div>
              </button>

              {expandedId === curso.id && (
                <div className="px-4 pb-4 space-y-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-base">Período de inscrição: {curso.period}</span>
                    <button
                      onClick={handleBack}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-700 transition-colors duration-200"
                    >
                      <img src={PencilIcon} alt="Editar" className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row md:space-x-6">
                    <span>Total de Inscrições: {curso.total}</span>
                    <span>Limite máximo: {curso.max}</span>
                  </div>
                  <span>Instituição responsável: {curso.instituicao}</span>
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default TelaDeCursosAtivos;
