import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BACKEND_URL } from '../../../services/api'; 

import { FiUpload, FiCheckCircle, FiXCircle, FiCalendar, FiLoader, FiAlertCircle, FiImage } from 'react-icons/fi';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return utcDate.toISOString().split('T')[0];
};

// Define o nome do arquivo placeholder que o backend usa
const PLACEHOLDER_FILENAME_FROM_BACKEND = "folhin.png";
// Define o segmento do caminho para banners (poderia ser dinâmico ou diferente para hortas)
const IMAGE_UPLOAD_PATH_SEGMENT = "banners"; 

const TelaDeEdicaoDeCursos = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [originalCurso, setOriginalCurso] = useState(null);
  const [bannerFile, setBannerFile] = useState(null); // Arquivo selecionado pelo usuário
  const [bannerPreview, setBannerPreview] = useState(null); // URL para o preview (blob local ou URL do servidor)
  
  const [loading, setLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [optionsLoading, setOptionsLoading] = useState(true);
  const [formOptions, setFormOptions] = useState({
    tiposAtividade: [],
    publicosAlvo: [],
    turnos: []
  });

  // URL completa para o placeholder servido pelo backend
  const SERVER_PLACEHOLDER_URL = `${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT}/${PLACEHOLDER_FILENAME_FROM_BACKEND}`;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/app/home'); 
        return;
      }
      try {
        setLoading(true); 
        setOptionsLoading(true); 
        const [cursoResponse, optionsResponse] = await Promise.all([
          api.get(`/cursos/${id}`),
          api.get('/cursos/opcoes') 
        ]);

        const data = cursoResponse.data;
        setOriginalCurso(data);
        setFormData({
          nome: data.nome || '',
          tipoAtividade: data.tipoAtividade || '',
          descricao: data.descricao || '',
          local: data.local || '',
          instituicao: data.instituicao || '',
          publicoAlvo: data.publicoAlvo || '',
          dataInicio: formatDateForInput(data.dataInicio),
          dataFim: formatDateForInput(data.dataFim),
          dataInscInicio: formatDateForInput(data.dataInscInicio),
          dataInscFim: formatDateForInput(data.dataInscFim),
          turno: data.turno || '',
          maxPessoas: data.maxPessoas?.toString() || '0',
          cargaHoraria: data.cargaHoraria?.toString() || '0',
          ativo: data.ativo ?? true,
        });
        
        if (data.fotoBanner) {
          // Constrói a URL para o banner do servidor (seja o real ou folhin.png do servidor)
          setBannerPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT}/${data.fotoBanner}`);
        } else {
          // Se o backend não retornar fotoBanner, teoricamente deveria ser "folhin.png"
          // mas para garantir, podemos tentar carregar o placeholder do servidor.
          // No entanto, a lógica do backend já deve garantir que data.fotoBanner seja "folhin.png" nesse caso.
          setBannerPreview(null); // Se for null, o JSX mostrará "Sem banner" e o onError da img tentará o placeholder.
                                  // Ou, para ser mais direto se o backend não retornar "folhin.png" quando deveria:
                                  // setBannerPreview(SERVER_PLACEHOLDER_URL); 
        }
        
        setFormOptions(optionsResponse.data); 
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar os dados do curso.');
        console.error("Erro ao buscar dados do curso:", err);
      } finally {
        setLoading(false); 
        setOptionsLoading(false); 
      }
    };
    fetchData();
  }, [id, navigate, SERVER_PLACEHOLDER_URL]); // Adicionado SERVER_PLACEHOLDER_URL se usado diretamente no useEffect

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = name === 'ativo' ? (value === 'true') : (type === 'checkbox' ? checked : value);
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  }, []); 

  const handleBannerChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file); // Armazena o ARQUIVO para upload
      setBannerPreview(URL.createObjectURL(file)); // Mostra o preview LOCAL da imagem selecionada
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData) {
        setFeedback({ type: 'error', message: 'Erro interno, dados do formulário não carregados.' }); 
        return;
    }
    setIsSubmitting(true); 
    setFeedback({ type: '', message: '' }); 

    const cursoJsonData = {
      nome: formData.nome,
      tipoAtividade: formData.tipoAtividade,
      descricao: formData.descricao,
      local: formData.local,
      instituicao: formData.instituicao,
      publicoAlvo: formData.publicoAlvo,
      dataInicio: formData.dataInicio,
      dataFim: formData.dataFim,
      dataInscInicio: formData.dataInscInicio,
      dataInscFim: formData.dataInscFim,
      turno: formData.turno,
      maxPessoas: Number(formData.maxPessoas) || 0,
      cargaHoraria: Number(formData.cargaHoraria) || 0,
      ativo: formData.ativo,
    };
    
    const submissionPayload = new FormData();
    submissionPayload.append('cursoDetails', new Blob([JSON.stringify(cursoJsonData)], { type: 'application/json' }));
    
    if (bannerFile) { 
      submissionPayload.append('bannerFile', bannerFile);
    }

    try {
      // Após o PUT, o backend deve retornar o CursoModel atualizado, incluindo o nome correto do fotoBanner.
      const response = await api.put(`/cursos/${id}`, submissionPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Atualiza o bannerPreview com a imagem confirmada pelo servidor
      if (response.data && response.data.fotoBanner) {
        setBannerPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT}/${response.data.fotoBanner}`);
      } else {
        // Se, por algum motivo, o backend não retornar fotoBanner, tenta o placeholder do servidor.
        setBannerPreview(SERVER_PLACEHOLDER_URL);
      }
      setBannerFile(null); // Limpa o arquivo selecionado após o envio bem-sucedido

      setFeedback({ type: 'success', message: 'Atividade atualizada com sucesso!' }); 
      setTimeout(() => navigate('/app/tela-de-cursos-ativos'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Falha ao salvar a atividade. Tente novamente.';
      setFeedback({ type: 'error', message: errorMessage }); 
      console.error("Erro ao atualizar curso:", err.response || err);
    } finally {
      setIsSubmitting(false); 
    }
  }, [id, navigate, formData, bannerFile, SERVER_PLACEHOLDER_URL]);

  if (loading) { 
    return <div className="flex-grow flex items-center justify-center"><FiLoader className="animate-spin text-4xl text-green-600" /></div>;
  }

  if (error) { 
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-red-500 p-4 text-center">
        <FiAlertCircle className="text-4xl mb-2" />
        <span>{error}</span>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">Voltar</button>
      </div>
    );
  }
  
  if (!formData) {
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-red-500 p-4 text-center">
            <FiAlertCircle className="text-4xl mb-2" />
            <span>Não foi possível carregar os dados para edição.</span>
            <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-200 rounded-md">Voltar</button>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} id="edit-curso-form" className="max-w-7xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Editando Atividade</h1>
            <p className="text-xl text-gray-500 mt-1 break-words">{originalCurso?.nome || 'Carregando nome...'}</p>
          </header>
          
          <main className="space-y-8">
            <section className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Informações Principais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Atividade</label>
                      <div className="flex space-x-4 p-2 bg-gray-100 rounded-md">
                      {optionsLoading ? <p>Carregando tipos...</p> : formOptions.tiposAtividade.length > 0 ? formOptions.tiposAtividade.map((type) => ( 
                          <label key={type} className={`flex-1 text-center py-2 rounded-md cursor-pointer transition-colors ${formData.tipoAtividade === type ? 'bg-green-600 text-white shadow' : 'hover:bg-gray-200'}`}>
                          <input type="radio" name="tipoAtividade" value={type} checked={formData.tipoAtividade === type} onChange={handleChange} className="sr-only"/> 
                          {type}
                          </label>
                      )) : <p>Nenhum tipo de atividade disponível.</p>}
                      </div>
                  </div>
                  <div className="md:col-span-2">
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome</label>
                      <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md"/>
                  </div>
                  <div className="md:col-span-2">
                      <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                      <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} required rows="5" className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"/>
                  </div>
                  <div>
                      <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
                      <input id="local" name="local" type="text" value={formData.local} onChange={handleChange} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md"/>
                  </div>
                  <div>
                      <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700">Instituição</label>
                      <input id="instituicao" name="instituicao" type="text" value={formData.instituicao} onChange={handleChange} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md"/>
                  </div>
              </div>
            </section>
            <section className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Banner, Detalhes e Status</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner</label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full sm:w-64 h-40 bg-gray-200 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                      {bannerPreview ? (
                        <img 
                          src={bannerPreview} 
                          alt="Preview do banner" 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Se a imagem atual (src) não for já o placeholder do servidor, tenta o placeholder do servidor.
                            if (e.target.src !== SERVER_PLACEHOLDER_URL) {
                              console.warn(`Falha ao carregar imagem: ${e.target.src}. Tentando placeholder do servidor: ${SERVER_PLACEHOLDER_URL}`);
                              e.target.src = SERVER_PLACEHOLDER_URL;
                            } else {
                              // Se até o placeholder do servidor falhar, loga um erro mais sério.
                              // Neste ponto, o ícone de imagem quebrada do navegador será exibido.
                              console.error(`Falha crítica ao carregar placeholder do servidor: ${SERVER_PLACEHOLDER_URL}`);
                              // Opcional: esconder a tag img para não mostrar o ícone quebrado
                              // e.target.style.display = 'none'; 
                              // Ou mostrar um ícone FiImage dentro deste div no lugar.
                            }
                          }} 
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <FiImage className="w-8 h-8 mb-1" />
                          <span className="text-sm">Sem banner</span>
                        </div>
                      )}
                    </div>
                    <label className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer hover:bg-gray-300">
                      <FiUpload className="w-5 h-5 mr-2" /><span>Alterar imagem</span>
                      <input type="file" accept="image/*" onChange={handleBannerChange} className="hidden" /> 
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="publicoAlvo" className="block text-sm font-medium text-gray-700">Público Alvo</label>
                    <select id="publicoAlvo" name="publicoAlvo" value={formData.publicoAlvo} onChange={handleChange} required disabled={optionsLoading} className="mt-1 w-full h-11 px-3 border border-gray-300 rounded-md disabled:bg-gray-100"> 
                      <option value="">{optionsLoading ? "Carregando..." : "Selecione"}</option>
                      {formOptions.publicosAlvo.map(p => <option key={p} value={p}>{p}</option>)} 
                    </select>
                  </div>
                  <div>
                    <label htmlFor="turno" className="block text-sm font-medium text-gray-700">Turno</label>
                    <select id="turno" name="turno" value={formData.turno} onChange={handleChange} required disabled={optionsLoading} className="mt-1 w-full h-11 px-3 border border-gray-300 rounded-md disabled:bg-gray-100"> 
                      <option value="">{optionsLoading ? "Carregando..." : "Selecione"}</option>
                      {formOptions.turnos.map(t => <option key={t} value={t}>{t}</option>)} 
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxPessoas" className="block text-sm font-medium text-gray-700">Nº de Vagas</label>
                    <input id="maxPessoas" name="maxPessoas" type="number" min="0" value={formData.maxPessoas} onChange={handleChange} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label htmlFor="cargaHoraria" className="block text-sm font-medium text-gray-700">Carga Horária (h)</label>
                    <input id="cargaHoraria" name="cargaHoraria" type="number" min="0" value={formData.cargaHoraria} onChange={handleChange} required className="mt-1 w-full h-11 px-4 border border-gray-300 rounded-md" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="ativo" className="block text-sm font-medium text-gray-700">Status da Atividade</label>
                    <select id="ativo" name="ativo" value={formData.ativo.toString()} onChange={handleChange} className="mt-1 w-full h-11 px-3 border border-gray-300 rounded-md"> 
                      <option value="true">Ativo</option>
                      <option value="false">Desativado</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
            <section className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Datas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">Início da Atividade</label>
                    <div className="relative"><FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400"/><input id="dataInicio" name="dataInicio" type="date" value={formData.dataInicio} onChange={handleChange} required className="mt-1 w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md"/></div>
                </div>
                <div>
                    <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">Fim da Atividade</label>
                    <div className="relative"><FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400"/><input id="dataFim" name="dataFim" type="date" value={formData.dataFim} onChange={handleChange} required className="mt-1 w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md"/></div>
                </div>
                <div>
                    <label htmlFor="dataInscInicio" className="block text-sm font-medium text-gray-700">Início das Inscrições</label>
                    <div className="relative"><FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400"/><input id="dataInscInicio" name="dataInscInicio" type="date" value={formData.dataInscInicio} onChange={handleChange} required className="mt-1 w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md"/></div>
                </div>
                <div>
                    <label htmlFor="dataInscFim" className="block text-sm font-medium text-gray-700">Fim das Inscrições</label>
                    <div className="relative"><FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400"/><input id="dataInscFim" name="dataInscFim" type="date" value={formData.dataInscFim} onChange={handleChange} required className="mt-1 w-full h-11 pl-10 pr-4 border border-gray-300 rounded-md"/></div>
                </div>
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
            <button type="button" onClick={() => navigate(-1)} disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-md transition-colors hover:bg-gray-300 disabled:opacity-50"> 
              Cancelar
            </button>
            <button type="submit" form="edit-curso-form" disabled={isSubmitting || !formData} 
              className="w-full sm:w-48 px-6 py-2 flex items-center justify-center bg-green-600 text-white font-semibold rounded-md transition-colors hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed">
              {isSubmitting ? <FiLoader className="animate-spin" /> : 'Salvar Alterações'} 
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TelaDeEdicaoDeCursos;