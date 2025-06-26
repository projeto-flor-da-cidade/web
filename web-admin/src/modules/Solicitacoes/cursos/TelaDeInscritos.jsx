// src/pages/App/TelaDeInscritos/TelaDeInscritos.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api'; // Assuming same path as in TelaDeCursosAtivos

import Header from '../../Home/components/Header'; // Assuming same path
import {
  FiUser, FiMail, FiCalendar, FiLoader, FiAlertCircle,
  FiArrowLeft, FiInbox
} from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Re-using the formatDate utility from TelaDeCursosAtivos
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  // Check if it's already in DD/MM/YYYY format or just a simple string
  if (typeof dateString === 'string' && dateString.includes('/') && !dateString.includes('-')) return dateString;

  try {
    const date = new Date(dateString);
    // Adjust for timezone offset to display local date correctly
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);

    const day = String(localDate.getDate()).padStart(2, '0');
    const month = String(localDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    console.warn("Erro ao formatar data:", dateString, e);
    return dateString; // Fallback to original string if formatting fails
  }
};

export default function TelaDeInscritos() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollmentsWithUsers, setEnrollmentsWithUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!courseId) {
      setError("ID do curso não fornecido.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch course details
      // 2. Fetch all enrollments
      // 3. Fetch all users
      // (Promise.all for parallel fetching)
      const [courseResponse, enrollmentsResponse, usersResponse] = await Promise.all([
        api.get(`/cursos/${courseId}`),
        api.get('/inscricoes'), // Assumes this endpoint is available and returns all enrollments
        api.get('/usuarios')    // Assumes this endpoint is available and returns all users
      ]);

      setCourse(courseResponse.data);

      const allEnrollments = enrollmentsResponse.data || [];
      const courseSpecificEnrollments = allEnrollments.filter(
        (e) => e.idCurso === parseInt(courseId)
      );

      const allUsers = usersResponse.data || [];
      // Create a map for quick user lookup.
      // Assuming user object has 'idUsuario', 'nome', and 'email'.
      // Adjust 'idUsuario' if your user model uses a different primary key name like 'id'.
      const usersMap = new Map(allUsers.map(user => [user.idUsuario, user]));

      const populatedEnrollments = courseSpecificEnrollments.map(enrollment => {
        const userDetails = usersMap.get(enrollment.idUsuario) || 
                            { nome: 'Usuário Desconhecido', email: 'N/A' };
        return {
          ...enrollment,
          usuario: userDetails,
        };
      }).sort((a, b) => new Date(a.dataInscricao) - new Date(b.dataInscricao)); // Sort by enrollment date

      setEnrollmentsWithUsers(populatedEnrollments);

    } catch (err) {
      console.error("Erro ao buscar dados dos inscritos:", err);
      let errorMessage = "Não foi possível carregar os dados dos inscritos.";
      if (err.response && err.response.status === 404) {
        errorMessage = "Curso ou informações de inscrição não encontrados.";
      } else if (err.response && err.response.status === 401) {
        errorMessage = "Você não tem permissão para ver estas informações. Faça login e tente novamente.";
         // redirect to login might be an option here
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F0F2EB] font-poppins">
        <Header title="Inscritos no Curso" />
        <div className="flex flex-1 items-center justify-center text-center p-10">
          <FiLoader className="w-12 h-12 text-green-600 animate-spin mr-4" />
          <div>
            <p className="text-xl font-semibold text-gray-700">Carregando Inscritos...</p>
            <p className="text-sm text-gray-500">Por favor, aguarde.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F0F2EB] font-poppins">
        <Header title="Erro" />
        <div className="flex flex-1 items-center justify-center text-center p-6 m-6 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col items-center">
            <FiAlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-xl font-semibold text-red-700">Erro ao Carregar Dados</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <button
              onClick={() => navigate(-1)} // Go back to the previous page
              className="mt-6 mr-2 px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
            >
              <FiArrowLeft className="inline mr-2" /> Voltar
            </button>
            <button
              onClick={fetchData}
              className="mt-6 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      <Header title={course ? `Inscritos: ${course.nome}` : "Inscritos no Curso"} />
      <ToastContainer position="bottom-right" autoClose={3500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 pt-6 sm:pt-8">
        <header className="mb-6 sm:mb-8 p-5 sm:p-6 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {course ? course.nome : "Carregando nome do curso..."}
              </h1>
              <p className="text-sm text-gray-600 mt-1">Lista de participantes inscritos neste curso.</p>
            </div>
            <button
                onClick={() => navigate(-1)} // Or specific path like /app/tela-de-cursos
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 ring-offset-1 focus:ring-green-500 transition-colors text-sm font-medium"
            >
                <FiArrowLeft className="w-4 h-4" /> Voltar
            </button>
          </div>
        </header>

        {enrollmentsWithUsers.length > 0 ? (
          <section className="bg-white rounded-xl shadow-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {enrollmentsWithUsers.map((enrollment, index) => (
                <li key={enrollment.id || index} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="mb-3 sm:mb-0">
                      <p className="text-md font-semibold text-green-700 flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-gray-500" />
                        {enrollment.usuario.nome}
                      </p>
                      {enrollment.usuario.email && enrollment.usuario.email !== 'N/A' && (
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                          <FiMail className="w-3 h-3 mr-2 text-gray-400" />
                          {enrollment.usuario.email}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center self-start sm:self-center">
                      <FiCalendar className="w-3 h-3 mr-1.5 text-gray-400" />
                      Inscrito em: {formatDate(enrollment.dataInscricao)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
              Total de inscritos: {enrollmentsWithUsers.length}
            </div>
          </section>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <FiInbox className="w-16 h-16 text-gray-400 mx-auto mb-5" />
            <h3 className="text-xl font-semibold text-gray-700">Nenhum Inscrito</h3>
            <p className="text-gray-500 mt-2 text-sm">
              Ainda não há ninguém inscrito neste curso ou as inscrições não puderam ser carregadas.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}