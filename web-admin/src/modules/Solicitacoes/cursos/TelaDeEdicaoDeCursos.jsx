import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Home/components/Header';
import ArrowUpCircle from '../../../assets/arrow-up-circle-outline.svg';
import CalendarOutline from '../../../assets/calendar-outline.svg';
import CheckmarkCircle from '../../../assets/checkmark-circle-outline.svg';
import CloseOutline from '../../../assets/close-outline.svg';

const STATUS_OPTIONS = ['Ativo', 'Desativado'];
const ATIVIDADE_OPTIONS = ['Curso', 'Oficina'];
const PUBLICO_OPTIONS = ['Geral', 'Interno', 'Comunidade', 'Estudantes', 'Idosos'];

const TelaDeEdicaoDeCursos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const curso = location.state;

  // Se não há curso no state, volta
  useEffect(() => {
    if (!curso) navigate(-1);
  }, [curso, navigate]);

  // Inicia estados já com os valores de curso
  const [atividade, setAtividade] = useState(curso?.tipo || 'Curso');
  const [nome, setNome] = useState(curso?.name || '');
  const [descricao, setDescricao] = useState(curso?.descricao || '');
  const [local, setLocal] = useState(curso?.local || '');
  const [bannerPreview, setBannerPreview] = useState(curso?.bannerUrl || null);
  const [instituicao, setInstituicao] = useState(curso?.instituicao || '');
  const [publicoAlvo, setPublicoAlvo] = useState(curso?.publicoAlvo || 'Geral');
  const [status, setStatus] = useState(curso?.status ? (STATUS_OPTIONS.includes(curso.status) ? curso.status : 'Ativo') : 'Ativo');
  const [dataInicio, setDataInicio] = useState(curso?.dataInicio || '');
  const [dataFim, setDataFim] = useState(curso?.dataFim || '');

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // TODO: chamar API de atualização com os estados
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <div className="sticky top-0 z-50"><Header /></div>
      <main className="container mx-auto p-6 pt-20">
        <h1 className="text-[39.3px] font-semibold mb-6">Edição – {nome}</h1>

        {/* Tipo de atividade */}
        <section className="mb-8">
          <h2 className="text-[30px] font-medium mb-4">Tipo de atividade formativa:</h2>
          <div className="flex space-x-6">
            {ATIVIDADE_OPTIONS.map(opt => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="atividade"
                  value={opt}
                  checked={atividade === opt}
                  onChange={() => setAtividade(opt)}
                />
                <span className="text-lg">{opt}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Dados principais */}
        <section className="mb-8 space-y-6">
          <div>
            <label className="block text-[30px] mb-2">Nome:</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-[30px] mb-2">Descrição da Atividade (com ementa):</label>
            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="w-full h-32 px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-[30px] mb-2">Local:</label>
            <input
              type="text"
              value={local}
              onChange={e => setLocal(e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </section>

        {/* Banner e Instituição */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-[30px] mb-2">Banner de apresentação:</label>
            <div className="flex items-center space-x-4">
              <div className="w-80 h-48 bg-white border rounded-md flex items-center justify-center overflow-hidden">
                {bannerPreview ? <img src={bannerPreview} alt="Banner preview" className="object-cover w-full h-full" /> : <span className="text-gray-400">Pré-visualização</span>}
              </div>
              <label className="flex items-center px-4 py-2 bg-gray-300 rounded-md cursor-pointer transition-colors duration-200 hover:bg-gray-400">
                <img src={ArrowUpCircle} alt="Selecionar" className="w-6 h-6 mr-2" />
                <span className="text-base">Selecionar imagem</span>
                <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-[30px] mb-2">Instituição/Grupo responsável:</label>
            <input
              type="text"
              value={instituicao}
              onChange={e => setInstituicao(e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </section>

        {/* Público, Datas e Status */}
        <section className="mb-8 space-y-6">
          <div>
            <label className="block text-[30px] mb-2">Público alvo:</label>
            <select
              value={publicoAlvo}
              onChange={e => setPublicoAlvo(e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {PUBLICO_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[30px] mb-2">Data início/fim:</label>
              <div className="space-y-4">
                <div className="flex items-center border rounded-md h-12 px-4">
                  <img src={CalendarOutline} alt="Calendário" className="w-6 h-6 mr-2" />
                  <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="w-full border-none focus:ring-0" />
                </div>
                <div className="flex items-center border rounded-md h-12 px-4">
                  <img src={CalendarOutline} alt="Calendário" className="w-6 h-6 mr-2" />
                  <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="w-full border-none focus:ring-0" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[30px] mb-2">Status:</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {STATUS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Footer Buttons */}
        <footer className="flex justify-end space-x-4">
          <button onClick={handleSave} className="flex items-center px-6 py-3 bg-[#60855f] text-white rounded-md transition-colors duration-200 hover:bg-[#4f704d] focus:outline-none focus:ring-2 focus:ring-green-500">
            <img src={CheckmarkCircle} alt="Confirmar" className="w-6 h-6 mr-2" /> Confirmar
          </button>
          <button onClick={() => navigate(-1)} className="flex items-center px-6 py-3 bg-gray-300 text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
            <img src={CloseOutline} alt="Cancelar" className="w-6 h-6 mr-2" /> Cancelar
          </button>
        </footer>
      </main>
    </div>
  );
};

export default TelaDeEdicaoDeCursos;