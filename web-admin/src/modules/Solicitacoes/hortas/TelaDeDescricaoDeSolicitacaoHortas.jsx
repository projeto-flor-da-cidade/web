import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api, { BACKEND_URL } from '../../../services/api';
import {
  FiLoader, FiAlertCircle, FiCalendar, FiCheckCircle, FiXCircle,
  FiMaximize2, FiUser, FiMapPin, FiGrid, FiUsers, FiClipboard, FiBriefcase, FiHome, FiLayers, FiActivity, FiEdit, FiChevronLeft,
  FiClock, FiImage, FiMessageSquare
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LOCAL_FALLBACK_IMAGE = "/placeholder-horta.png";

const ALL_HORTA_STATUS_OPTIONS = [
  { value: 'ATIVA', label: 'Ativa', iconComponent: FiCheckCircle, iconBaseClass: "text-green-500", color: 'text-green-700 bg-green-100' },
  { value: 'INATIVA', label: 'Inativa/Recusada', iconComponent: FiXCircle, iconBaseClass: "text-red-500", color: 'text-red-700 bg-red-100' },
  { value: 'PENDENTE', label: 'Pendente', iconComponent: FiClock, iconBaseClass: "text-yellow-500", color: 'text-yellow-700 bg-yellow-100' },
  { value: 'VISITA_AGENDADA', label: 'Visita Agendada', iconComponent: FiCalendar, iconBaseClass: "text-blue-500", color: 'text-blue-700 bg-blue-100' },
];

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return localDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (_e) {
    return dateString;
  }
};

const Section = ({ title, icon: IconComponent, children, className = "" }) => (
  <section className={`bg-white p-4 sm:p-5 rounded-xl shadow-lg ${className}`}>
    <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
      {IconComponent && <IconComponent className="mr-2.5 text-green-600 w-5 h-5 flex-shrink-0" />}
      {title}
    </h2>
    {children}
  </section>
);

const InfoGrid = ({ children, cols = 2 }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-${cols} gap-x-5 gap-y-2.5 text-sm text-gray-700`}>
    {children}
  </div>
);

const InfoItem = ({ label, value, href, fullWidth = false, children }) => (
  <div className={fullWidth ? "sm:col-span-2" : ""}>
    <strong className="text-gray-500 font-medium">{label}:</strong>{' '}
    {children ? children : (
      href ? (
        <a href={href} className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">{value || 'N/A'}</a>
      ) : (
        <span className="break-words">{value || 'N/A'}</span>
      )
    )}
  </div>
);

const ActionButton = ({ icon: IconComponent, text, onClick, isSubmitting = false, color = 'gray', className = "", href, target }) => {
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400',
    green: 'bg-green-600 hover:bg-green-700 disabled:bg-green-400',
    red: 'bg-red-600 hover:bg-red-700 disabled:bg-red-400',
    whatsapp: 'bg-green-500 hover:bg-green-600 disabled:bg-green-300',
    gray: 'bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400'
  };
  const commonProps = {
    disabled: isSubmitting,
    className: `w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md transition-colors text-sm font-medium disabled:opacity-70 ${colorClasses[color]} ${className}`
  };
  const buttonContent = (
    <>
      {isSubmitting ? <FiLoader className="animate-spin w-5 h-5" /> : (IconComponent && <IconComponent className="w-5 h-5" />)}
      {text}
    </>
  );
  if (href) {
    return (
      <a href={href} target={target || "_blank"} rel="noopener noreferrer" {...commonProps} onClick={onClick}>
        {buttonContent}
      </a>
    );
  }
  return (
    <button onClick={onClick} {...commonProps}>
      {buttonContent}
    </button>
  );
};

export default function TelaDeDescricaoDeSolicitacaoHortas() {
  const { id: hortaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [horta, setHorta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [currentHortaImage, setCurrentHortaImage] = useState(null);

  const fetchHortaDetails = useCallback(async () => {
    if (!hortaId) {
      toast.error("ID da horta não fornecido para descrição.");
      navigate(-1);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/hortas/${hortaId}`);
      if (response.data) {
        setHorta(response.data);
      } else {
        throw new Error("Dados da horta não encontrados na resposta da API.");
      }
    } catch (_err) {
      setError("Não foi possível carregar os detalhes da solicitação.");
      toast.error("Falha ao carregar detalhes da horta.");
    } finally {
      setIsLoading(false);
    }
  }, [hortaId, navigate]);

  useEffect(() => {
    fetchHortaDetails();
  }, [fetchHortaDetails]);
  
  useEffect(() => {
    let imageUrl = LOCAL_FALLBACK_IMAGE;
    if (horta?.imagemCaminho) {
      const imageName = horta.imagemCaminho.trim();
      if (imageName !== "" && imageName !== "folhin.png") {
        imageUrl = `${BACKEND_URL}/uploads/imagem/${imageName}`;
      }
      else if (imageName === "folhin.png") {
        imageUrl = `${BACKEND_URL}/uploads/imagem/folhin.png`;
      }
    }
    setCurrentHortaImage(imageUrl);
  }, [horta]);

  const handleImageError = (e) => {
    if (e.target.src !== LOCAL_FALLBACK_IMAGE) {
      e.target.onerror = null; 
      e.target.src = LOCAL_FALLBACK_IMAGE;
    }
  };

  const handleApiAction = async (newStatus) => {
    if (!horta) return;
    setIsSubmittingAction(true);
    try {
      await api.patch(`/hortas/${horta.idHorta}/status?status=${newStatus}`);
      const statusOption = ALL_HORTA_STATUS_OPTIONS.find(s => s.value === newStatus);
      const statusLabel = statusOption ? statusOption.label : newStatus;
      toast.success(<span>Solicitação da horta <strong>"{horta.nomeHorta}"</strong> atualizada para <strong>{statusLabel}</strong>!</span>);
      setHorta(prevHorta => prevHorta ? ({ ...prevHorta, statusHorta: newStatus }) : null);
      setTimeout(() => {
        if (location.state?.source === 'solicitacoes') {
          navigate('/app/solicitacoes-hortas');
        } else {
          navigate('/app/gerenciamento-hortas');
        }
      }, 2000);
    } catch (_err) {
      toast.error("Falha ao processar a ação. Tente novamente.");
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleAgendarVisitaWhatsApp = () => {
    if (!horta || !horta.usuario || !horta.usuario.pessoa || !horta.usuario.pessoa.telefone) {
      toast.warn("Número de telefone do solicitante não disponível.");
      return;
    }
    const numeroLimpo = horta.usuario.pessoa.telefone.replace(/\D/g, '');
    let numeroWhatsApp = numeroLimpo;
    if ((numeroLimpo.length === 10 || numeroLimpo.length === 11) && !numeroLimpo.startsWith('55')) {
      numeroWhatsApp = `55${numeroLimpo}`;
    } else if (numeroLimpo.length > 11 && numeroLimpo.startsWith('55')) {
        numeroWhatsApp = numeroLimpo;
    }
    const nomeHortaEncoded = encodeURIComponent(horta.nomeHorta || "Horta Solicitada");
    const mensagem = encodeURIComponent(`Olá, ${horta.usuario.pessoa.nome || 'solicitante'}! Entro em contato referente à solicitação da "${nomeHortaEncoded}" para agendarmos uma visita técnica.`);
    const whatsappUrl = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(whatsappUrl, '_blank');
  };

  const openImageModal = () => {
    if (currentHortaImage && currentHortaImage !== LOCAL_FALLBACK_IMAGE) {
        setImageModalOpen(true);
    }
  };
  const closeImageModal = () => setImageModalOpen(false);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-4">
        <FiLoader className="animate-spin text-5xl text-green-600" />
        <p className="mt-4 text-lg text-gray-700">Carregando detalhes da solicitação...</p>
      </div>
    );
  }
  if (error || !horta) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-4 text-center">
        <FiAlertCircle className="text-5xl text-red-500 mb-3" />
        <p className="text-lg font-semibold text-red-600">Erro ao Carregar</p>
        <span className="text-red-500">{error || "Dados da horta não encontrados."}</span>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
        >
          Voltar
        </button>
      </div>
    );
  }

  const usuario = horta?.usuario;
  const pessoa = usuario?.pessoa;
  const statusAtualInfo = ALL_HORTA_STATUS_OPTIONS.find(s => s.value === horta?.statusHorta) || { label: horta?.statusHorta, color: 'bg-gray-100 text-gray-800' };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins pt-10 sm:pt-16 pb-10">
      <ToastContainer position="top-right" autoClose={3500} theme="colored" />
      <div className="container mx-auto px-3 sm:px-4">
        <header className="mb-6 sm:mb-8 pb-4 text-center md:text-left border-b border-gray-200">
          <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center">
            <FiChevronLeft className="mr-1" /> Voltar para lista
          </button>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Solicitação de Horta #{horta?.idHorta}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mt-1 break-words">
            {horta?.nomeHorta || "Nome da Horta Indisponível"}
          </h1>
          <div className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusAtualInfo.color}`}>
            Status: {statusAtualInfo.label}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Informações do Solicitante" icon={FiUser}>
              <InfoGrid>
                <InfoItem label="Nome" value={pessoa?.nome} />
                <InfoItem label="Matrícula" value={usuario?.matricula} />
                <InfoItem label="Email" value={pessoa?.email} href={pessoa?.email ? `mailto:${pessoa.email}`: undefined} />
                <InfoItem label="Telefone" value={pessoa?.telefone} href={pessoa?.telefone ? `tel:${pessoa.telefone}`: undefined}/>
                <InfoItem label="Escolaridade" value={pessoa?.escolaridade?.toString().replace(/_/g, ' ') || 'N/A'} />
                <InfoItem label="Função/Cargo" value={horta?.funcaoUniEnsino} />
              </InfoGrid>
            </Section>

            <Section title="Detalhes da Horta" icon={FiMapPin}>
              <InfoGrid>
                <InfoItem label="Tipo de Horta" value={horta?.tipoDeHorta?.nome} />
                <InfoItem label="Endereço Principal" value={horta?.endereco} fullWidth={!horta?.enderecoAlternativo} />
                {horta?.enderecoAlternativo && <InfoItem label="Endereço Alternativo" value={horta.enderecoAlternativo} />}
                <InfoItem label="Classificação da Área" value={horta?.areaClassificacao?.nome} />
                <InfoItem label="Tamanho (m²)" value={horta?.tamanhoAreaProducao ? horta.tamanhoAreaProducao.toLocaleString('pt-BR') : 'N/A'} />
                <InfoItem label="Atividade Produtiva Principal" value={horta?.atividadesProdutivas?.nome} />
                <InfoItem label="Ocupação Principal da Área" value={horta?.ocupacaoPrincipal} />
                <InfoItem label="Unidade de Ensino (se aplicável)" value={horta?.unidadeDeEnsino?.nome} />
                <InfoItem label="Possui Parceria" value={horta?.parceria || "Não"} />
                <InfoItem label="Data da Solicitação" value={formatDate(horta?.dataCriacao)} />
              </InfoGrid>
            </Section>

            <Section title="Grupo e Atividades Propostas" icon={FiUsers}>
              <InfoGrid cols={1}>
                <InfoItem label="Característica do Grupo" value={horta?.caracteristicaGrupo} />
                <InfoItem label="Nº de Pessoas Interessadas" value={horta?.qntPessoas} />
                <div className="mt-2">
                  <strong className="text-gray-600 block mb-1 text-sm">Descrição das Atividades Planejadas:</strong>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md border whitespace-pre-wrap text-sm">
                    {horta?.atividadeDescricao || 'Nenhuma descrição fornecida.'}
                  </p>
                </div>
              </InfoGrid>
            </Section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20 self-start">
            <Section title="Imagem da Horta" icon={FiImage}>
              {/* O contêiner da imagem */}
              <div
                className="relative w-full aspect-video rounded-lg overflow-hidden group shadow bg-gray-200"
                onClick={openImageModal}
              >
                {currentHortaImage && (
                  <img
                    src={currentHortaImage}
                    alt={horta?.nomeHorta ? `Imagem da Horta ${horta.nomeHorta}` : "Imagem da Horta"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={handleImageError}
                    style={{ cursor: currentHortaImage !== LOCAL_FALLBACK_IMAGE ? 'pointer' : 'default' }}
                  />
                )}
                {/* O overlay para o ícone de expandir */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  {currentHortaImage && currentHortaImage !== LOCAL_FALLBACK_IMAGE && (
                     <FiMaximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                  )}
                </div>
              </div>
            </Section>

            {horta?.statusHorta === 'PENDENTE' && (
              <Section title="Ações da Solicitação" icon={FiClipboard}>
                <div className="space-y-2.5">
                  <ActionButton icon={FiMessageSquare} text="Agendar Visita (WhatsApp)" onClick={handleAgendarVisitaWhatsApp} isSubmitting={isSubmittingAction} color="whatsapp" />
                  <ActionButton icon={FiCheckCircle} text="Aprovar Solicitação" onClick={() => handleApiAction('ATIVA')} isSubmitting={isSubmittingAction} color="green" />
                  <ActionButton icon={FiXCircle} text="Recusar Solicitação" onClick={() => handleApiAction('INATIVA')} isSubmitting={isSubmittingAction} color="red" />
                </div>
              </Section>
            )}
            <Section title="Outras Ações" icon={FiEdit}>
              <ActionButton
                icon={FiEdit}
                text="Editar Dados da Horta"
                onClick={() => {
                  if (hortaId) {
                    navigate(`/app/hortas-editar/${hortaId}`);
                  }
                }}
                isSubmitting={false}
                color="gray"
              />
            </Section>
          </aside>
        </div>
      </div>

      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={closeImageModal}
        >
          <div className="relative max-w-3xl max-h-[90vh] shadow-2xl rounded-lg" onClick={(_e) => _e.stopPropagation()}>
            <img
              src={currentHortaImage}
              alt={horta?.nomeHorta ? `Imagem da Horta ${horta.nomeHorta} Ampliada` : "Imagem da Horta Ampliada"}
              className="block max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeImageModal}
              className="absolute -top-3 -right-3 sm:top-2 sm:right-2 bg-gray-800/60 text-white rounded-full p-1 hover:bg-gray-700/80 transition-colors"
              aria-label="Fechar imagem ampliada"
            >
              <FiXCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}