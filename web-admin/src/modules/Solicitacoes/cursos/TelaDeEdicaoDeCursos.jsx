import React, { useState, useEffect, useCallback } from 'react'; // Removido useRef
import { useParams, useNavigate } from 'react-router-dom';
import api, { BACKEND_URL } from '../../../services/api'; 
// import Header from '../../Home/components/Header'; 
import { FiUpload, FiCheckCircle, FiXCircle, FiCalendar, FiLoader, FiAlertCircle, FiImage } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.warn("Erro ao formatar data para input:", dateString, e);
    return '';
  }
};

const PLACEHOLDER_FILENAME_FROM_BACKEND = "folhin.png";
const IMAGE_UPLOAD_PATH_SEGMENT = "banners"; 

export default function TelaDeEdicaoDeCursos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [originalCurso, setOriginalCurso] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  
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

  const SERVER_PLACEHOLDER_URL = `${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT}/${PLACEHOLDER_FILENAME_FROM_BACKEND}`;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.warn("ID do curso não encontrado, redirecionando.");
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
        if (!data) {
            throw new Error("Dados do curso não encontrados na resposta da API.");
        }
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
        
        if (data.fotoBanner && data.fotoBanner !== PLACEHOLDER_FILENAME_FROM_BACKEND) {
          setBannerPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT}/${data.fotoBanner}`);
        } else {
          setBannerPreview(SERVER_PLACEHOLDER_URL); 
        }
        
        setFormOptions(optionsResponse.data); 
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar os dados do curso para edição.');
        console.error("Erro ao buscar dados do curso:", err);
      } finally {
        setLoading(false); 
        setOptionsLoading(false); 
      }
    };
    fetchData();
  }, [id, navigate, SERVER_PLACEHOLDER_URL]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = name === 'ativo' ? (value === 'true') : (type === 'checkbox' ? checked : value);
    setFormData(prev => {
      if (prev === null) return null;
      return { ...prev, [name]: finalValue };
    });
  }, []); 

  const handleBannerChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        toast.error("O arquivo do banner não pode exceder 2MB.");
        return;
      }
      setBannerFile(file); 
      setBannerPreview(URL.createObjectURL(file)); 
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData) {
        toast.error('Erro: Dados do formulário não estão prontos.');
        setFeedback({ type: 'error', message: 'Dados do formulário não carregados.' }); 
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
    submissionPayload.append('curso', new Blob([JSON.stringify(cursoJsonData)], { type: 'application/json' })); 
    
    if (bannerFile) { 
      submissionPayload.append('banner', bannerFile); 
    }

    try {
      const response = await api.put(`/cursos/${id}`, submissionPayload);

      toast.success('Atividade atualizada com sucesso!');
      setFeedback({ type: 'success', message: 'Atividade atualizada com sucesso!' }); 

      if (response.data && response.data.fotoBanner) {
        setBannerPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT}/${response.data.fotoBanner}`);
      } else {
        setBannerPreview(SERVER_PLACEHOLDER_URL);
      }
      setBannerFile(null); 
      setOriginalCurso(response.data); 
      
      setTimeout(() => navigate('/app/tela-de-cursos-ativos'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Falha ao atualizar a atividade. Verifique os campos e tente novamente.';
      toast.error(errorMessage);
      setFeedback({ type: 'error', message: errorMessage }); 
      console.error("Erro ao atualizar curso:", err.response || err);
    } finally {
      setIsSubmitting(false); 
    }
  }, [id, navigate, formData, bannerFile, SERVER_PLACEHOLDER_URL]);

  // JSX para loading e error states (sem alterações)
  if (loading || !formData) { 
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4">
        <FiLoader className="animate-spin text-5xl text-green-600" />
        <p className="mt-4 text-lg text-gray-600">Carregando dados do curso...</p>
      </div>
    );
  }

  if (error) { 
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4 text-center">
        <FiAlertCircle className="text-5xl text-red-500 mb-3" />
        <p className="text-lg font-semibold text-red-600">Erro ao Carregar</p>
        <span className="text-red-500">{error}</span>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Tentar Novamente
        </button>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-3 px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Voltar
        </button>
      </div>
    );
  }
  
  // JSX do return principal do formulário (sem alterações na estrutura)
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* <Header title="Edição de Curso" /> */}
      <ToastContainer position="top-right" autoClose={3500} theme="colored" hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <div className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} id="edit-curso-form" className="max-w-4xl mx-auto space-y-8">
            <header className="pb-6 border-b border-gray-200">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Editando Atividade: <span className="text-green-600">{originalCurso?.nome || ''}</span>
              </h1>
              <p className="text-md text-gray-500 mt-1">Modifique as informações da atividade abaixo.</p>
            </header>
            
            <main className="space-y-6">
              <section className="p-5 sm:p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-5 text-gray-700">Informações Principais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atividade</label>
                        <div className="flex space-x-3 p-1.5 bg-gray-100 rounded-md">
                        {optionsLoading ? <p className="text-sm text-gray-500 p-2">Carregando tipos...</p> : formOptions.tiposAtividade.length > 0 ? formOptions.tiposAtividade.map((type) => ( 
                            <label key={type} className={`flex-1 text-center py-2 px-3 rounded-md cursor-pointer transition-colors text-xs sm:text-sm ${formData.tipoAtividade === type ? 'bg-green-600 text-white shadow-md' : 'hover:bg-gray-200'}`}>
                            <input type="radio" name="tipoAtividade" value={type} checked={formData.tipoAtividade === type} onChange={handleChange} className="sr-only"/> 
                            {type}
                            </label>
                        )) : <p className="text-sm text-gray-500 p-2">Nenhum tipo disponível.</p>}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome da Atividade</label>
                        <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} required rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="local" className="block text-sm font-medium text-gray-700">Local</label>
                        <input id="local" name="local" type="text" value={formData.local} onChange={handleChange} required className="mt-1 block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700">Instituição</label>
                        <input id="instituicao" name="instituicao" type="text" value={formData.instituicao} onChange={handleChange} required className="mt-1 block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"/>
                    </div>
                </div>
              </section>

              <section className="p-5 sm:p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-5 text-gray-700">Detalhes da Atividade</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 items-start">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Banner da Atividade</label>
                    <div className="w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden relative group">
                      {bannerPreview ? (
                        <img 
                          src={bannerPreview} 
                          alt="Preview do banner" 
                          className="object-contain w-full h-full" 
                          onError={(e) => {
                            if (e.target.src !== SERVER_PLACEHOLDER_URL) {
                              e.target.src = SERVER_PLACEHOLDER_URL;
                            } else {
                               e.target.onerror = null; 
                               e.target.alt = "Falha ao carregar imagem placeholder";
                            }
                          }} 
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                          <FiImage className="w-10 h-10 mb-1" />
                          <span className="text-xs">Nenhum banner selecionado</span>
                        </div>
                      )}
                    </div>
                    <label className="w-full cursor-pointer flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                      <FiUpload className="w-4 h-4 mr-2" /><span>Alterar Imagem</span>
                      <input type="file" name="bannerFile" accept="image/png, image/jpeg, image/webp" onChange={handleBannerChange} className="hidden" /> 
                    </label>
                    <p className="text-xs text-gray-500">Envie PNG, JPG ou WEBP (max. 2MB).</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label htmlFor="publicoAlvo" className="block text-sm font-medium text-gray-700">Público Alvo</label>
                      <select id="publicoAlvo" name="publicoAlvo" value={formData.publicoAlvo} onChange={handleChange} required disabled={optionsLoading} className="mt-1 block w-full h-10 pl-3 pr-10 py-0 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"> 
                        <option value="">{optionsLoading ? "Carregando..." : "Selecione"}</option>
                        {formOptions.publicosAlvo.map(p => <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>)} 
                      </select>
                    </div>
                    <div>
                      <label htmlFor="turno" className="block text-sm font-medium text-gray-700">Turno</label>
                      <select id="turno" name="turno" value={formData.turno} onChange={handleChange} required disabled={optionsLoading} className="mt-1 block w-full h-10 pl-3 pr-10 py-0 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-100"> 
                        <option value="">{optionsLoading ? "Carregando..." : "Selecione"}</option>
                        {formOptions.turnos.map(t => <option key={t} value={t}>{t}</option>)} 
                      </select>
                    </div>
                    <div>
                      <label htmlFor="maxPessoas" className="block text-sm font-medium text-gray-700">Nº de Vagas</label>
                      <input id="maxPessoas" name="maxPessoas" type="number" min="0" value={formData.maxPessoas} onChange={handleChange} required className="mt-1 block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="cargaHoraria" className="block text-sm font-medium text-gray-700">Carga Horária (h)</label>
                      <input id="cargaHoraria" name="cargaHoraria" type="number" min="0" value={formData.cargaHoraria} onChange={handleChange} required className="mt-1 block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="ativo" className="block text-sm font-medium text-gray-700">Status da Atividade</label>
                      <select id="ativo" name="ativo" value={formData.ativo.toString()} onChange={handleChange} className="mt-1 block w-full h-10 pl-3 pr-10 py-0 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"> 
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <section className="p-5 sm:p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-5 text-gray-700">Datas Importantes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <div>
                      <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">Início da Atividade</label>
                      <div className="relative mt-1"><FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/><input id="dataInicio" name="dataInicio" type="date" value={formData.dataInicio} onChange={handleChange} required className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"/></div>
                  </div>
                  <div>
                      <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">Fim da Atividade</label>
                      <div className="relative mt-1"><FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/><input id="dataFim" name="dataFim" type="date" value={formData.dataFim} onChange={handleChange} required className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"/></div>
                  </div>
                  <div>
                      <label htmlFor="dataInscInicio" className="block text-sm font-medium text-gray-700">Início das Inscrições</label>
                      <div className="relative mt-1"><FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/><input id="dataInscInicio" name="dataInscInicio" type="date" value={formData.dataInscInicio} onChange={handleChange} required className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"/></div>
                  </div>
                  <div>
                      <label htmlFor="dataInscFim" className="block text-sm font-medium text-gray-700">Fim das Inscrições</label>
                      <div className="relative mt-1"><FiCalendar className="absolute top-1/2 left-3 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/><input id="dataInscFim" name="dataInscFim" type="date" value={formData.dataInscFim} onChange={handleChange} required className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"/></div>
                  </div>
                </div>
              </section>
            </main>
          </form>
        </div>
        <footer className="flex-shrink-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] p-4 sticky bottom-0 z-10 border-t border-gray-200">
          <div className="max-w-4xl mx-auto flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
            <div className="h-6 min-w-[250px] flex-shrink-0"> 
              {feedback.message && ( 
                  <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback.type === 'success' ? <FiCheckCircle /> : <FiXCircle />}
                      <span>{feedback.message}</span>
                  </div>
              )}
            </div>
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => navigate(-1)} disabled={isSubmitting} className="w-full sm:w-auto px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-md transition-colors hover:bg-gray-300 disabled:opacity-60 text-sm"> 
                Cancelar
              </button>
              <button type="submit" form="edit-curso-form" disabled={isSubmitting || !formData || loading || optionsLoading} 
                className="w-full sm:w-auto min-w-[150px] px-5 py-2 flex items-center justify-center bg-green-600 text-white font-semibold rounded-md transition-colors hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-sm">
                {isSubmitting ? <FiLoader className="animate-spin text-lg" /> : 'Salvar Alterações'} 
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}