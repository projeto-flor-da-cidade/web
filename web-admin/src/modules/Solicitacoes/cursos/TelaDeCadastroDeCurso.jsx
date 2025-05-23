import React, { useState } from 'react';
import Header from '../../Home/components/Header';
import ArrowUpCircle from '../../../assets/arrow-up-circle-outline.svg';
import CalendarOutline from '../../../assets/calendar-outline.svg';
import CheckmarkCircle from '../../../assets/checkmark-circle-outline.svg';
import CloseOutline from '../../../assets/close-outline.svg';

const TelaDeCadastroDeCurso = () => {
  const [atividade, setAtividade] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [bannerPreview, setBannerPreview] = useState(null);
  const [instituicao, setInstituicao] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('Geral');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [ativarAutomatico, setAtivarAutomatico] = useState(false);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Header fixo */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      {/* Espaçamento abaixo do header */}
      <main className="container mx-auto p-6 pt-20">
        {/* Título */}
        <h1 className="text-[39.3px] font-semibold mb-6">Cadastro de Curso</h1>

        {/* Tipo de atividade */}
        <section className="mb-8">
          <h2 className="text-[30px] font-medium mb-4">Tipo de atividade formativa:</h2>
          <div className="flex space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="atividade"
                value="Curso"
                checked={atividade === 'Curso'}
                onChange={() => setAtividade('Curso')}
              />
              <span className="text-lg">Curso</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="atividade"
                value="Oficina"
                checked={atividade === 'Oficina'}
                onChange={() => setAtividade('Oficina')}
              />
              <span className="text-lg">Oficina</span>
            </label>
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
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner preview" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400">Pré-visualização</span>
                )}
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

        {/* Público, Datas e Ativação */}
        <section className="mb-8 space-y-6">
          <div>
            <label className="block text-[30px] mb-2">Público alvo:</label>
            <select
              value={publicoAlvo}
              onChange={e => setPublicoAlvo(e.target.value)}
              className="w-full h-12 px-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Interno</option>
              <option>Comunidade</option>
              <option>Estudantes</option>
              <option>Idosos</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[30px] mb-2">Data início/fim:</label>
              <div className="space-y-4">
                <div className="flex items-center border rounded-md h-12 px-4">
                  <img src={CalendarOutline} alt="Calendário" className="w-6 h-6 mr-2" />
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                    className="w-full border-none focus:ring-0"
                  />
                </div>
                <div className="flex items-center border rounded-md h-12 px-4">
                  <img src={CalendarOutline} alt="Calendário" className="w-6 h-6 mr-2" />
                  <input
                    type="date"
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                    className="w-full border-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center mt-8 max-w-max">
              <input
                type="checkbox"
                checked={ativarAutomatico}
                onChange={e => setAtivarAutomatico(e.target.checked)}
                size={'large'}
                className="mr-2"
              />
              <span className="text-[30px]">Criar Curso e ativá-lo automaticamente</span>
            </div>
          </div>
        </section>

        {/* Footer Buttons */}
        <footer className="flex justify-end space-x-4">
          <button className="flex items-center px-6 py-3 bg-[#60855f] text-white rounded-md transition-colors duration-200 hover:bg-[#4f704d] focus:outline-none focus:ring-2 focus:ring-green-500">
            <img src={CheckmarkCircle} alt="Confirmar" className="w-6 h-6 mr-2" />
            Confirmar
          </button>
          <button className="flex items-center px-6 py-3 bg-gray-300 text-gray-700 rounded-md transition-colors duration-200 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
            <img src={CloseOutline} alt="Cancelar" className="w-6 h-6 mr-2" />
            Cancelar
          </button>
        </footer>
      </main>
    </div>
  );
};

export default TelaDeCadastroDeCurso;