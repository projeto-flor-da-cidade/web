import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api'; 
import { FiUpload, FiCheckCircle, FiXCircle, FiCalendar, FiLoader } from 'react-icons/fi';

const TelaDeCadastroDeCurso = () => {
  const navigate = useNavigate();

  // --- ESTADOS DO FORMULÁRIO ---
  const [tipoAtividade, setTipoAtividade] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dataInscInicio, setDataInscInicio] = useState('');
  const [dataInscFim, setDataInscFim] = useState('');
  const [turno, setTurno] = useState('');
  const [maxPessoas, setMaxPessoas] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [ativo, setAtivo] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // --- ESTADOS PARA OPÇÕES DINÂMICAS ---
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [formOptions, setFormOptions] = useState({
    tiposAtividade: [],
    publicosAlvo: [],
    turnos: []
  });

  // --- BUSCA AS OPÇÕES DO BACK-END QUANDO A TELA CARREGA ---
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setOptionsLoading(true);
        const response = await api.get('/cursos/opcoes');
        const { tiposAtividade, publicosAlvo, turnos } = response.data;
        
        setFormOptions({ tiposAtividade, publicosAlvo, turnos });

        // Define o valor inicial dos campos para a primeira opção da lista
        if (tiposAtividade?.length > 0) setTipoAtividade(tiposAtividade[0]);
        if (publicosAlvo?.length > 0) setPublicoAlvo(publicosAlvo[0]);
        if (turnos?.length > 0) setTurno(turnos[0]);

      } catch (error) {
        console.error("Erro ao buscar opções do formulário:", error);
        setFeedback({ type: 'error', message: 'Não foi possível carregar as opções do formulário.' });
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchOptions();
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez.

  const handleCancel = () => {
    navigate('/app/home');
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTipoAtividade(formOptions.tiposAtividade[0] || '');
    setNome(''); setDescricao(''); setLocal(''); setInstituicao('');
    setPublicoAlvo(formOptions.publicosAlvo[0] || '');
    setDataInicio(''); setDataFim('');
    setDataInscInicio(''); setDataInscFim('');
    setTurno(formOptions.turnos[0] || '');
    setMaxPessoas(''); setCargaHoraria(''); setAtivo(false);
    setBannerFile(null); setBannerPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ type: '', message: '' });
    const cursoData = { tipoAtividade, nome, descricao, local, instituicao, publicoAlvo, dataInicio, dataFim, dataInscInicio, dataInscFim, turno, maxPessoas: Number(maxPessoas) || 0, cargaHoraria: Number(cargaHoraria) || 0, ativo };
    const formData = new FormData();
    formData.append('curso', new Blob([JSON.stringify(cursoData)], { type: 'application/json' }));
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    try {
      await api.post('/cursos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFeedback({ type: 'success', message: 'Atividade cadastrada com sucesso!' });
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao cadastrar a atividade.';
      setFeedback({ type: 'error', message: errorMessage });
      console.error("Erro no cadastro:", error);
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback({ type: '', message: '' }), 5000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} id="curso-form" className="max-w-7xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Cadastro de Atividade</h1>
            <p className="text-gray-500 mt-1">Preencha os campos abaixo para criar uma nova atividade formativa.</p>
          </header>
          
          <main className="space-y-8">
            <section className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Informações Principais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Atividade</label>
                  <div className="flex space-x-4 p-2 bg-gray-100 rounded-md">
                    {optionsLoading ? <p className="text-sm text-gray-500">Carregando...</p> : 
                      formOptions.tiposAtividade.map((type) => (
                        <label key={type} className={`flex-1 text-center py-2 rounded-md cursor-pointer transition-colors ${tipoAtividade === type ? 'bg-green-600 text-white shadow' : 'hover:bg-gray-200'}`}>
                          <input type="radio" name="atividade" value={type} checked={tipoAtividade === type} onChange={() => setTipoAtividade(type)} className="sr-only"/>
                          {type}
                        </label>
                      ))
                    }
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome da Atividade</label>
                  <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} required rows="5" className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
                  <input id="local" type="text" value={local} onChange={e => setLocal(e.target.value)} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700">Instituição Responsável</label>
                  <input id="instituicao" type="text" value={instituicao} onChange={e => setInstituicao(e.target.value)} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </section>

            <section className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Banner e Detalhes</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner de Apresentação</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-64 h-40 bg-gray-200 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                      {bannerPreview ? <img src={bannerPreview} alt="Preview" className="object-cover w-full h-full" /> : <span className="text-gray-500 text-sm">Pré-visualização</span>}
                    </div>
                    <label className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer transition-colors hover:bg-gray-300">
                      <FiUpload className="w-5 h-5 mr-2" /><span>Selecionar imagem</span>
                      <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div>
                    <label htmlFor="publicoAlvo" className="block text-sm font-medium text-gray-700">Público Alvo</label>
                    <select id="publicoAlvo" value={publicoAlvo} onChange={e => setPublicoAlvo(e.target.value)} required disabled={optionsLoading} className="mt-1 w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100">
                      {formOptions.publicosAlvo.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="turno" className="block text-sm font-medium text-gray-700">Turno</label>
                    <select id="turno" value={turno} onChange={e => setTurno(e.target.value)} required disabled={optionsLoading} className="mt-1 w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100">
                      {formOptions.turnos.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxPessoas" className="block text-sm font-medium text-gray-700">Nº de Vagas</label>
                    <input id="maxPessoas" type="number" value={maxPessoas} onChange={e => setMaxPessoas(e.target.value)} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label htmlFor="cargaHoraria" className="block text-sm font-medium text-gray-700">Carga Horária (h)</label>
                    <input id="cargaHoraria" type="number" value={cargaHoraria} onChange={e => setCargaHoraria(e.target.value)} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>
              </div>
            </section>

            <section className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Datas e Ativação</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[ {id: 'dataInicio', label: 'Início da Atividade', value: dataInicio, setter: setDataInicio}, {id: 'dataFim', label: 'Fim da Atividade', value: dataFim, setter: setDataFim}, {id: 'dataInscInicio', label: 'Início Inscrições', value: dataInscInicio, setter: setDataInscInicio}, {id: 'dataInscFim', label: 'Fim Inscrições', value: dataInscFim, setter: setDataInscFim} ].map(field => (
                  <div key={field.id} className="relative">
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}</label>
                    <FiCalendar className="absolute top-9 left-3 w-5 h-5 text-gray-400 pointer-events-none"/>
                    <input id={field.id} type="date" value={field.value} onChange={e => field.setter(e.target.value)} required className="mt-1 w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center">
                  <input id="ativo" type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} className="h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                  <label htmlFor="ativo" className="ml-3 block text-sm font-medium text-gray-700">Ativar e abrir inscrições imediatamente</label>
              </div>
            </section>
          </main>
        </form>
      </div>

      <footer className="flex-shrink-0 bg-white shadow-top p-4">
        <div className="max-w-7xl mx-auto flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          <div className="h-6">
            {feedback.message && (
                <div className={`flex items-center gap-2 text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.type === 'success' ? <FiCheckCircle /> : <FiXCircle />}
                    <span>{feedback.message}</span>
                </div>
            )}
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <button type="button" onClick={handleCancel} disabled={loading} className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-md transition-colors hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
            <button type="submit" form="curso-form" disabled={loading} className="w-full sm:w-40 px-6 py-2 flex items-center justify-center bg-green-600 text-white font-semibold rounded-md transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400">
              {loading ? <FiLoader className="animate-spin" /> : 'Confirmar'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TelaDeCadastroDeCurso;