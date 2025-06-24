// src/modules/Tecnicos/TelaCadastroTecnico.jsx (ou caminho similar)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho se necessário
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSave, FiUserPlus, FiLoader, FiAlertCircle, FiMapPin, FiChevronLeft, FiEye, FiEyeOff } from 'react-icons/fi'; // Adicionado FiEye, FiEyeOff

// Simulação de um Header, substitua se tiver um global ou remova se não necessário aqui
const HeaderSimples = ({ title, onBack }) => (
  <header className="bg-white shadow-sm p-4 mb-6 flex items-center sticky top-16 z-10">
    {onBack && (
      <button onClick={onBack} className="mr-4 p-2 rounded-full hover:bg-gray-100" aria-label="Voltar">
        <FiChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
    )}
    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
  </header>
);


const initialFormData = {
  nome: '',
  matricula: '',
  senha: '',
  confirmarSenha: '',
  status: 'ATIVO',
  isAdm: false,
  regiaoId: '',
};

export default function TelaCadastroTecnico() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [regioes, setRegioes] = useState([]);
  const [loadingRegioes, setLoadingRegioes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(null); // null, true, ou false

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  useEffect(() => {
    // console.log("TelaCadastroTecnico: Verificando permissão de Admin..."); // Log opcional
    const tecnicoLogado = localStorage.getItem('usuario');
    if (tecnicoLogado) {
      try {
        const dadosTecnico = JSON.parse(tecnicoLogado);
        if (dadosTecnico && dadosTecnico.isAdm === true) {
          setIsAdminUser(true);
        } else {
          toast.error("Acesso negado. Apenas administradores podem cadastrar técnicos.");
          setIsAdminUser(false);
          navigate('/app/home', { replace: true });
        }
      } catch (e) {
        toast.error("Erro ao verificar permissões de administrador.");
        setIsAdminUser(false);
        navigate('/app/home', { replace: true });
      }
    } else {
      toast.error("Você precisa estar logado como administrador para acessar esta página.");
      setIsAdminUser(false);
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (isAdminUser === true) {
      const fetchRegioes = async () => {
        setLoadingRegioes(true);
        try {
          const response = await api.get('/regioes'); 
          setRegioes(response.data || []);
        } catch (error) {
          // console.error("TelaCadastroTecnico: Erro ao buscar regiões:", error); // Log opcional
          toast.error("Não foi possível carregar as regiões.");
        } finally {
          setLoadingRegioes(false);
        }
      };
      fetchRegioes();
    } else if (isAdminUser === false) {
      setLoadingRegioes(false);
    }
  }, [isAdminUser]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem!");
      return;
    }
    if (formData.senha.length < 8) {
        toast.error("A senha deve ter no mínimo 8 caracteres.");
        return;
    }
    if (!formData.regiaoId) {
        toast.error("Por favor, selecione uma região.");
        return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nome: formData.nome,
        matricula: formData.matricula,
        senha: formData.senha,
        status: formData.status,
        isAdm: formData.isAdm, // Importante: este valor booleano será enviado
        regiao: { idRegiao: parseInt(formData.regiaoId, 10) },
      };
      // console.log("Enviando payload para /api/tecnicos:", payload); // Log opcional para ver o que está sendo enviado
      await api.post('/tecnicos', payload);
      toast.success("Técnico cadastrado com sucesso!");
      setFormData(initialFormData); // Limpa o formulário
      // navigate('/app/gerenciamento-tecnicos'); // Ou para onde você gerencia técnicos
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data || "Erro ao cadastrar técnico.";
      toast.error(errorMsg);
      // console.error("Erro ao cadastrar técnico:", error.response || error); // Log opcional
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdminUser === null || (isAdminUser === true && loadingRegioes)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FiLoader className="animate-spin text-4xl text-green-600" />
        <p className="ml-3 text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  if (isAdminUser === false) {
    // O useEffect já deve ter redirecionado, mas isso garante que nada seja renderizado.
    return null; 
  }
  
  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <ToastContainer position="top-center" autoClose={4000} theme="colored" />
      {/* Removido HeaderSimples, pois o Header global do ProtectedLayout deve estar presente */}
      
      <div className="p-4 sm:p-6 lg:p-8 mt-16"> {/* mt-16 para o Header global fixo */}
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <div className="text-center mb-8 relative"> {/* Adicionado relative para posicionar o botão voltar */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute top-0 left-0 text-gray-600 hover:text-gray-800 p-2" 
                    aria-label="Voltar"
                >
                    <FiChevronLeft size={24}/>
                </button>
                <FiUserPlus className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                Cadastrar Novo Técnico
                </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo *</label>
                    <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className="mt-1 input-style" />
                </div>
                <div>
                    <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">Matrícula *</label>
                    <input type="text" name="matricula" id="matricula" value={formData.matricula} onChange={handleChange} required className="mt-1 input-style" />
                </div>
                
                {/* Campo Senha com visualização */}
                <div>
                    <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha *</label>
                    <div className="relative mt-1">
                        <input
                        type={mostrarSenha ? "text" : "password"}
                        name="senha"
                        id="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        minLength={8}
                        className="input-style pr-10"
                        />
                        <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setMostrarSenha(prev => !prev)}
                        aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                        {mostrarSenha ? 
                            <FiEyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" /> : 
                            <FiEye className="h-5 w-5 text-gray-500 hover:text-gray-700" />}
                        </button>
                    </div>
                </div>

                {/* Campo Confirmar Senha com visualização */}
                <div>
                    <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">Confirmar Senha *</label>
                    <div className="relative mt-1">
                        <input
                        type={mostrarConfirmarSenha ? "text" : "password"}
                        name="confirmarSenha"
                        id="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        required
                        className="input-style pr-10"
                        />
                        <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        onClick={() => setMostrarConfirmarSenha(prev => !prev)}
                        aria-label={mostrarConfirmarSenha ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                        >
                        {mostrarConfirmarSenha ? 
                            <FiEyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" /> : 
                            <FiEye className="h-5 w-5 text-gray-500 hover:text-gray-700" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="regiaoId" className="block text-sm font-medium text-gray-700">Região *</label>
                    <select name="regiaoId" id="regiaoId" value={formData.regiaoId} onChange={handleChange} required disabled={loadingRegioes} className="mt-1 select-style">
                    <option value="">{loadingRegioes ? 'Carregando Regiões...' : 'Selecione a Região'}</option>
                    {regioes.map(regiao => (
                        <option key={regiao.idRegiao} value={regiao.idRegiao}>{regiao.nome}</option>
                    ))}
                    </select>
                    {loadingRegioes && <FiLoader className="animate-spin inline-block ml-2 text-sm text-gray-500" />}
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} required className="mt-1 select-style">
                    <option value="ATIVO">Ativo</option>
                    <option value="INATIVO">Inativo</option>
                    </select>
                </div>
                <div className="flex items-center">
                    <input id="isAdm" name="isAdm" type="checkbox" checked={formData.isAdm} onChange={handleChange} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                    <label htmlFor="isAdm" className="ml-3 block text-sm font-medium text-gray-800">Conceder privilégios de Administrador</label>
                </div>
                <div className="pt-2">
                    <button
                    type="submit"
                    disabled={isSubmitting || loadingRegioes}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                    {isSubmitting ? <FiLoader className="animate-spin h-5 w-5 mr-2" /> : <FiSave className="h-5 w-5 mr-2" />}
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar Técnico'}
                    </button>
                </div>
            </form>
        </div>
      </div>
      <style jsx global>{`
        .input-style { margin-top: 0.25rem; display: block; width: 100%; height: 2.5rem; padding-left: 0.75rem; padding-right: 0.75rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); font-size: 0.875rem; line-height: 1.25rem;}
        .input-style:focus { outline: none; box-shadow: 0 0 0 2px #10B981; border-color: #059669; }
        .select-style { margin-top: 0.25rem; display: block; width: 100%; height: 2.5rem; padding-left: 0.75rem; padding-right: 2.5rem; border-width: 1px; border-color: #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); background-color: white; font-size: 0.875rem; line-height: 1.25rem; appearance: none; background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; }
        .select-style:focus { outline: none; box-shadow: 0 0 0 2px #10B981; border-color: #059669; }
        .select-style:disabled { background-color: #F3F4F6; opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}