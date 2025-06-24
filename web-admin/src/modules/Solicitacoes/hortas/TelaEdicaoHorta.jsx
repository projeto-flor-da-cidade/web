// Caminho do Arquivo: seu-projeto-frontend/src/pages/TelaEdicaoHorta.jsx (ou caminho similar)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BACKEND_URL } from '../../../services/api'; 
import { FiUpload, FiSave, FiRotateCcw, FiImage, FiLoader, FiAlertCircle, FiChevronLeft } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PLACEHOLDER_IMAGE_HORTA = "/placeholder-horta.png";
const IMAGE_UPLOAD_PATH_SEGMENT_HORTA = "imagem";

const initialFormDataState = {
  nomeHorta: '', funcaoUniEnsino: '', ocupacaoPrincipal: '', endereco: '', enderecoAlternativo: '',
  tamanhoAreaProducao: '', caracteristicaGrupo: '', qntPessoas: '', atividadeDescricao: '',
  parceria: '', statusHorta: 'PENDENTE', idUsuario: '', idUnidadeEnsino: '',
  idAreaClassificacao: '', idAtividadesProdutivas: '', idTipoDeHorta: '',
};

export default function TelaEdicaoHorta() {
  const { id: hortaIdFromParams } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormDataState);
  const [originalHorta, setOriginalHorta] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(PLACEHOLDER_IMAGE_HORTA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [tiposDeHortaOptions, setTiposDeHortaOptions] = useState([]);
  const [usuariosOptions, setUsuariosOptions] = useState([]);
  const [unidadesEnsinoOptions, setUnidadesEnsinoOptions] = useState([]);
  const [areasClassificacaoOptions, setAreasClassificacaoOptions] = useState([]);
  const [atividadesProdutivasOptions, setAtividadesProdutivasOptions] = useState([]);

  // ALTERAÇÃO APLICADA: URLs da API corrigidas dentro desta função
  const fetchDropdownOptions = useCallback(async () => {
    setOptionsLoading(true);
    try {
      const [
        tiposRes, usuariosRes, unidadesRes, areasRes, atividadesRes,
      ] = await Promise.all([
        api.get('/hortas/tipo'),                     // CORRIGIDO
        api.get('/usuarios'),                        // CORRIGIDO
        api.get('/hortas/unidade-ensino'),         // CORRIGIDO
        api.get('/hortas/areas-classificacao'),    // CORRIGIDO
        api.get('/hortas/atividades-produtivas'),  // CORRIGIDO
      ]);
      setTiposDeHortaOptions(tiposRes.data || []);
      setUsuariosOptions(usuariosRes.data || []);
      setUnidadesEnsinoOptions(unidadesRes.data || []);
      setAreasClassificacaoOptions(areasRes.data || []);
      setAtividadesProdutivasOptions(atividadesRes.data || []);
    } catch (err) {
      toast.error("Falha ao carregar opções dos formulários.");
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDropdownOptions();
  }, [fetchDropdownOptions]);
  
  useEffect(() => {
    const fetchHortaData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/hortas/${hortaIdFromParams}`);
        const data = response.data;
        setOriginalHorta(data);
        setFormData({
          nomeHorta: data.nomeHorta || '',
          funcaoUniEnsino: data.funcaoUniEnsino || '',
          ocupacaoPrincipal: data.ocupacaoPrincipal || '',
          endereco: data.endereco || '',
          enderecoAlternativo: data.enderecoAlternativo || '',
          tamanhoAreaProducao: data.tamanhoAreaProducao?.toString() || '',
          caracteristicaGrupo: data.caracteristicaGrupo || '',
          qntPessoas: data.qntPessoas?.toString() || '',
          atividadeDescricao: data.atividadeDescricao || '',
          parceria: data.parceria || '',
          statusHorta: data.statusHorta || 'PENDENTE',
          idUsuario: data.usuario?.idUsuario?.toString() || '',
          idUnidadeEnsino: data.unidadeDeEnsino?.idUnidadeDeEnsino?.toString() || '',
          idAreaClassificacao: data.areaClassificacao?.idAreaClassificacao?.toString() || '',
          idAtividadesProdutivas: data.atividadesProdutivas?.idAtividadesProdutivas?.toString() || '',
          idTipoDeHorta: data.tipoDeHorta?.idTipoDeHorta?.toString() || '',
        });
        if (data.imagemCaminho && data.imagemCaminho !== "folhin.png") {
          setImagemPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT_HORTA}/${data.imagemCaminho}`);
        } else if (data.imagemCaminho === "folhin.png") {
          setImagemPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT_HORTA}/folhin.png`);
        } else {
          setImagemPreview(PLACEHOLDER_IMAGE_HORTA);
        }
      } catch (err) {
        setError('Não foi possível carregar os dados da horta para edição.');
        toast.error("Falha ao carregar dados da horta.");
      } finally {
        setIsLoading(false);
      }
    };

    if (!hortaIdFromParams) {
      toast.error("ID da horta inválido para edição.");
      navigate('/app/gerenciamento-hortas');
      setIsLoading(false);
      setOptionsLoading(false);
      return;
    }

    if (!optionsLoading) {
      fetchHortaData();
    } else {
      setIsLoading(true);
    }
  }, [hortaIdFromParams, navigate, optionsLoading]);


  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("A imagem é muito grande. Máximo de 5MB.");
        e.target.value = null;
        return;
      }
      setImagemFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagemFile(null);
      if (originalHorta?.imagemCaminho && originalHorta.imagemCaminho !== "folhin.png") {
        setImagemPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT_HORTA}/${originalHorta.imagemCaminho}`);
      } else if (originalHorta?.imagemCaminho === "folhin.png") {
        setImagemPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT_HORTA}/folhin.png`);
      } else {
        setImagemPreview(PLACEHOLDER_IMAGE_HORTA);
      }
    }
  }, [originalHorta]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData || !originalHorta) {
      toast.error('Erro: Dados do formulário ou originais não estão prontos.');
      return;
    }
    const requiredFields = [
      { name: 'nomeHorta', label: 'Nome da Horta' }, { name: 'endereco', label: 'Endereço Principal' },
      { name: 'tamanhoAreaProducao', label: 'Tamanho da Área' }, { name: 'qntPessoas', label: 'Nº de Pessoas Envolvidas' },
      { name: 'atividadeDescricao', label: 'Descrição das Atividades' }, { name: 'statusHorta', label: 'Status da Horta' },
      { name: 'idTipoDeHorta', label: 'Tipo de Horta' }, { name: 'idUsuario', label: 'Usuário Responsável' },
      { name: 'idUnidadeEnsino', label: 'Unidade de Ensino' }, { name: 'idAreaClassificacao', label: 'Classificação da Área' },
      { name: 'idAtividadesProdutivas', label: 'Atividade Produtiva Principal' },
    ];
    for (const field of requiredFields) {
      if (!formData[field.name] || String(formData[field.name]).trim() === '') {
        toast.error(`O campo "${field.label}" é obrigatório.`);
        return;
      }
    }

    setIsSubmitting(true);
    const submissionPayload = new FormData();
    Object.keys(formData).forEach(key => {
      if (key.startsWith('id') && formData[key]) {
        submissionPayload.append(key, formData[key]);
      } else if (!key.startsWith('id')) {
        submissionPayload.append(key, formData[key] || "");
      }
    });
    submissionPayload.set('tamanhoAreaProducao', formData.tamanhoAreaProducao || '0');
    submissionPayload.set('qntPessoas', formData.qntPessoas || '0');
    if (imagemFile) {
      submissionPayload.append('imagem', imagemFile);
    }

    try {
      const response = await api.put(`/hortas/${hortaIdFromParams}`, submissionPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Horta atualizada com sucesso!');
      setOriginalHorta(response.data);
      if (response.data.imagemCaminho && response.data.imagemCaminho !== "folhin.png") {
        setImagemPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT_HORTA}/${response.data.imagemCaminho}`);
      } else if (response.data.imagemCaminho === "folhin.png") {
        setImagemPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT_HORTA}/folhin.png`);
      } else {
        setImagemPreview(PLACEHOLDER_IMAGE_HORTA);
      }
      setImagemFile(null);
    } catch (err) {
      let errorMessage = 'Falha ao atualizar a horta.';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') errorMessage = err.response.data;
        else if (err.response.data.message) errorMessage = err.response.data.message;
        else if (err.response.data.error) errorMessage = err.response.data.error;
        else if (Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
          errorMessage = err.response.data.errors.map(errorItem => errorItem.defaultMessage || errorItem.message).join('; ');
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [hortaIdFromParams, formData, imagemFile, originalHorta, navigate]);

  const handleResetForm = useCallback(() => {
    if (originalHorta) {
      setFormData({
        nomeHorta: originalHorta.nomeHorta || '', funcaoUniEnsino: originalHorta.funcaoUniEnsino || '',
        ocupacaoPrincipal: originalHorta.ocupacaoPrincipal || '', endereco: originalHorta.endereco || '',
        enderecoAlternativo: originalHorta.enderecoAlternativo || '',
        tamanhoAreaProducao: originalHorta.tamanhoAreaProducao?.toString() || '',
        caracteristicaGrupo: originalHorta.caracteristicaGrupo || '', qntPessoas: originalHorta.qntPessoas?.toString() || '',
        atividadeDescricao: originalHorta.atividadeDescricao || '', parceria: originalHorta.parceria || '',
        statusHorta: originalHorta.statusHorta || 'PENDENTE',
        idUsuario: originalHorta.usuario?.idUsuario?.toString() || '',
        idUnidadeEnsino: originalHorta.unidadeDeEnsino?.idUnidadeDeEnsino?.toString() || '',
        idAreaClassificacao: originalHorta.areaClassificacao?.idAreaClassificacao?.toString() || '',
        idAtividadesProdutivas: originalHorta.atividadesProdutivas?.idAtividadesProdutivas?.toString() || '',
        idTipoDeHorta: originalHorta.tipoDeHorta?.idTipoDeHorta?.toString() || '',
      });
      if (originalHorta.imagemCaminho && originalHorta.imagemCaminho !== "folhin.png") {
        setImagemPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT_HORTA}/${originalHorta.imagemCaminho}`);
      } else if (originalHorta.imagemCaminho === "folhin.png") {
        setImagemPreview(`${BACKEND_URL}/uploads/${IMAGE_UPLOAD_PATH_SEGMENT_HORTA}/folhin.png`);
      } else {
        setImagemPreview(PLACEHOLDER_IMAGE_HORTA);
      }
      setImagemFile(null);
      toast.info("Formulário restaurado para os valores originais.");
    } else {
      setFormData(initialFormDataState);
      setImagemPreview(PLACEHOLDER_IMAGE_HORTA);
      setImagemFile(null);
      toast.info("Formulário resetado para valores iniciais.");
    }
  }, [originalHorta]);

  if (isLoading || (optionsLoading && hortaIdFromParams)) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-4">
        <FiLoader className="animate-spin text-5xl text-green-600" />
        <p className="mt-4 text-lg text-gray-700">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-4 text-center">
        <FiAlertCircle className="text-5xl text-red-500 mb-3" />
        <p className="text-lg font-semibold text-red-600">Erro ao Carregar</p>
        <span className="text-red-500">{error}</span>
        <button
          onClick={() => navigate('/app/gerenciamento-hortas')}
          className="mt-6 px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
        >
          Voltar para Gerenciamento
        </button>
      </div>
    );
  }
  
  if (hortaIdFromParams && !originalHorta && !isLoading) {
     return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-4 text-center">
        <FiAlertCircle className="text-5xl text-orange-500 mb-3" />
        <p className="text-lg font-semibold text-orange-600">Horta não encontrada</p>
        <span className="text-orange-500">A horta com o ID fornecido não foi encontrada ou não pôde ser carregada.</span>
        <button
          onClick={() => navigate('/app/gerenciamento-hortas')}
          className="mt-6 px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
        >
          Voltar para Gerenciamento
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-poppins">
      <ToastContainer position="top-right" autoClose={3500} theme="colored" />
      <div className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} id="edit-horta-form" className="max-w-4xl mx-auto space-y-6">
            <header className="pb-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mb-2 text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                  aria-label="Voltar"
                >
                  <FiChevronLeft className="mr-1 h-5 w-5" />
                  Voltar
                </button>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Editando Horta: <span className="text-green-600">{originalHorta?.nomeHorta || (hortaIdFromParams ? 'Carregando...' : 'Inválida')}</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">Modifique as informações da horta abaixo.</p>
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                disabled={isSubmitting || !originalHorta}
                className="p-2 text-gray-500 hover:text-blue-600 disabled:opacity-50"
                title="Restaurar dados originais"
              >
                <FiRotateCcw className="w-5 h-5" />
              </button>
            </header>

            <section className="p-5 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Informações Gerais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="nomeHorta" className="block text-sm font-medium text-gray-700">Nome da Horta *</label>
                  <input id="nomeHorta" name="nomeHorta" type="text" value={formData.nomeHorta} onChange={handleChange} required className="mt-1 input-style" />
                </div>
                <div>
                  <label htmlFor="statusHorta" className="block text-sm font-medium text-gray-700">Status da Horta *</label>
                  <select id="statusHorta" name="statusHorta" value={formData.statusHorta} onChange={handleChange} required className="mt-1 select-style">
                    <option value="PENDENTE">Pendente</option>
                    <option value="ATIVA">Ativa</option>
                    <option value="INATIVA">Inativa</option>
                    <option value="VISITA_AGENDADA">Visita Agendada</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço Principal *</label>
                  <input id="endereco" name="endereco" type="text" value={formData.endereco} onChange={handleChange} required className="mt-1 input-style" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="enderecoAlternativo" className="block text-sm font-medium text-gray-700">Endereço Alternativo</label>
                  <input id="enderecoAlternativo" name="enderecoAlternativo" type="text" value={formData.enderecoAlternativo} onChange={handleChange} className="mt-1 input-style" />
                </div>
              </div>
            </section>

            <section className="p-5 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Detalhes da Área e Grupo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label htmlFor="tamanhoAreaProducao" className="block text-sm font-medium text-gray-700">Tamanho da Área (m²) *</label>
                  <input id="tamanhoAreaProducao" name="tamanhoAreaProducao" type="number" step="0.1" min="0" value={formData.tamanhoAreaProducao} onChange={handleChange} required className="mt-1 input-style" />
                </div>
                <div>
                  <label htmlFor="qntPessoas" className="block text-sm font-medium text-gray-700">Nº de Pessoas Envolvidas *</label>
                  <input id="qntPessoas" name="qntPessoas" type="number" min="1" value={formData.qntPessoas} onChange={handleChange} required className="mt-1 input-style" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="caracteristicaGrupo" className="block text-sm font-medium text-gray-700">Características do Grupo</label>
                  <textarea id="caracteristicaGrupo" name="caracteristicaGrupo" value={formData.caracteristicaGrupo} onChange={handleChange} rows="3" className="mt-1 textarea-style" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="atividadeDescricao" className="block text-sm font-medium text-gray-700">Descrição das Atividades *</label>
                  <textarea id="atividadeDescricao" name="atividadeDescricao" value={formData.atividadeDescricao} onChange={handleChange} required rows="3" className="mt-1 textarea-style" />
                </div>
              </div>
            </section>

            <section className="p-5 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Associações e Imagem</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-start">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="idTipoDeHorta" className="block text-sm font-medium text-gray-700">Tipo de Horta *</label>
                    <select name="idTipoDeHorta" id="idTipoDeHorta" value={formData.idTipoDeHorta} onChange={handleChange} required disabled={optionsLoading} className="mt-1 select-style">
                      <option value="">{optionsLoading ? 'Carregando...' : 'Selecione o Tipo'}</option>
                      {tiposDeHortaOptions.map(opt => <option key={opt.idTipoDeHorta} value={opt.idTipoDeHorta}>{opt.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="idUsuario" className="block text-sm font-medium text-gray-700">Usuário Responsável *</label>
                    <select name="idUsuario" id="idUsuario" value={formData.idUsuario} onChange={handleChange} required disabled={optionsLoading} className="mt-1 select-style">
                      <option value="">{optionsLoading ? 'Carregando...' : 'Selecione o Usuário'}</option>
                      {usuariosOptions.map(opt => <option key={opt.idUsuario} value={opt.idUsuario}>{opt.pessoa?.nome || `Usuário ID: ${opt.idUsuario}`}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="idUnidadeEnsino" className="block text-sm font-medium text-gray-700">Unidade de Ensino *</label>
                    <select name="idUnidadeEnsino" id="idUnidadeEnsino" value={formData.idUnidadeEnsino} onChange={handleChange} required disabled={optionsLoading} className="mt-1 select-style">
                      <option value="">{optionsLoading ? 'Carregando...' : 'Selecione a Unidade'}</option>
                      {unidadesEnsinoOptions.map(opt => <option key={opt.idUnidadeDeEnsino} value={opt.idUnidadeDeEnsino}>{opt.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="idAreaClassificacao" className="block text-sm font-medium text-gray-700">Classificação da Área *</label>
                    <select name="idAreaClassificacao" id="idAreaClassificacao" value={formData.idAreaClassificacao} onChange={handleChange} required disabled={optionsLoading} className="mt-1 select-style">
                      <option value="">{optionsLoading ? 'Carregando...' : 'Selecione a Área'}</option>
                      {areasClassificacaoOptions.map(opt => <option key={opt.idAreaClassificacao} value={opt.idAreaClassificacao}>{opt.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="idAtividadesProdutivas" className="block text-sm font-medium text-gray-700">Atividade Produtiva Principal *</label>
                    <select name="idAtividadesProdutivas" id="idAtividadesProdutivas" value={formData.idAtividadesProdutivas} onChange={handleChange} required disabled={optionsLoading} className="mt-1 select-style">
                      <option value="">{optionsLoading ? 'Carregando...' : 'Selecione a Atividade'}</option>
                      {atividadesProdutivasOptions.map(opt => <option key={opt.idAtividadesProdutivas} value={opt.idAtividadesProdutivas}>{opt.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="funcaoUniEnsino" className="block text-sm font-medium text-gray-700">Função na Unidade de Ensino</label>
                    <input id="funcaoUniEnsino" name="funcaoUniEnsino" type="text" value={formData.funcaoUniEnsino} onChange={handleChange} className="mt-1 input-style" />
                  </div>
                  <div>
                    <label htmlFor="ocupacaoPrincipal" className="block text-sm font-medium text-gray-700">Ocupação Principal da Área</label>
                    <input id="ocupacaoPrincipal" name="ocupacaoPrincipal" type="text" value={formData.ocupacaoPrincipal} onChange={handleChange} className="mt-1 input-style" />
                  </div>
                  <div>
                    <label htmlFor="parceria" className="block text-sm font-medium text-gray-700">Parceria (se houver)</label>
                    <input id="parceria" name="parceria" type="text" value={formData.parceria} onChange={handleChange} className="mt-1 input-style" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Imagem da Horta</label>
                  <div className="w-full h-48 sm:h-56 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                    {imagemPreview ? (
                      <img
                        src={imagemPreview}
                        alt="Preview da Horta"
                        className="object-contain w-full h-full"
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = PLACEHOLDER_IMAGE_HORTA;
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 p-4 text-center">
                        <FiImage className="w-10 h-10 mb-1" />
                        <span className="text-xs">Nenhuma imagem selecionada ou imagem atual</span>
                      </div>
                    )}
                  </div>
                  <label htmlFor="imagem-upload-horta" className="w-full cursor-pointer flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                    <FiUpload className="w-4 h-4 mr-2" /><span>Alterar Imagem</span>
                  </label>
                  <input id="imagem-upload-horta" type="file" name="imagemFile" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} className="hidden" />
                  <p className="text-xs text-gray-500">Envie PNG, JPG ou WEBP (max. 5MB).</p>
                </div>
              </div>
            </section>
          </form>
        </div>
        <footer className="flex-shrink-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] p-4 sticky bottom-0 z-10 border-t border-gray-200">
          <div className="max-w-4xl mx-auto flex flex-col-reverse sm:flex-row justify-end items-center gap-3">
            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2 bg-gray-200 text-gray-700 font-medium rounded-md transition-colors hover:bg-gray-300 disabled:opacity-60 text-sm flex items-center justify-center gap-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="edit-horta-form"
                disabled={isSubmitting || isLoading || optionsLoading || !originalHorta}
                className="w-full sm:w-auto min-w-[150px] px-5 py-2 flex items-center justify-center bg-green-600 text-white font-semibold rounded-md transition-colors hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? <FiLoader className="animate-spin text-lg" /> : <><FiSave className="w-4 h-4 mr-2"/> Salvar Alterações</>}
              </button>
            </div>
          </div>
        </footer>
      </div>
      <style jsx global>{`
        .input-style { margin-top: 0.25rem; display: block; width: 100%; height: 2.5rem; padding-left: 0.75rem; padding-right: 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; line-height: 1.25rem;}
        .input-style:focus { outline: none; box-shadow: 0 0 0 2px #10B981; border-color: #059669; }
        .select-style { margin-top: 0.25rem; display: block; width: 100%; height: 2.5rem; padding-left: 0.75rem; padding-right: 2.5rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); background-color: white; font-size: 0.875rem; line-height: 1.25rem; appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; }
        .select-style:focus { outline: none; box-shadow: 0 0 0 2px #10B981; border-color: #059669; }
        .select-style:disabled { background-color: #F3F4F6; opacity: 0.7; cursor: not-allowed; }
        .textarea-style { margin-top: 0.25rem; display: block; width: 100%; padding-left: 0.75rem; padding-right: 0.75rem; padding-top: 0.5rem; padding-bottom: 0.5rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; line-height: 1.25rem; resize: vertical; }
        .textarea-style:focus { outline: none; box-shadow: 0 0 0 2px #10B981; border-color: #059669; }
      `}</style>
    </div>
  );
}