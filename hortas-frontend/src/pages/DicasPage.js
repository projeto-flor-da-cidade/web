import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FacebookShareButton, TwitterShareButton } from 'react-share';

const DicasPage = () => {
  const [dicas, setDicas] = useState([]);

  useEffect(() => {
    const fetchDicas = async () => {
      try {
        const response = await axios.get('/api/dicas'); // Ajuste conforme sua API
        setDicas(response.data);
      } catch (error) {
        console.error("Erro ao buscar dicas:", error);
      }
    };
    fetchDicas();
  }, []);

  return (
    <div className="container mx-auto p-6 text-center text-recifeBlue bg-cover bg-center min-h-screen" style={{ backgroundImage: "url('/images/fundo.jpg')" }}>
      {/* Caixa Branca para o Conteúdo */}
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">🌱 Dicas de Plantio e Cultivo 🌿</h2>

        <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
          Cultivar uma horta urbana pode ser simples e muito recompensador!  
          Aqui estão algumas dicas essenciais para ajudá-lo a começar e manter sua horta saudável.  
        </p>

        <ul className="text-left max-w-3xl mx-auto space-y-6">
          {dicas.map((dica) => (
            <li key={dica.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">{dica.conteudo}</p>
            </li>
          ))}
        </ul>

        {/* Dicas adicionais fixas */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold">🌻 Dicas Essenciais para sua Horta Urbana</h3>
          <ul className="text-lg leading-relaxed max-w-3xl mx-auto space-y-4 mt-4 text-left font-semibold">
            <li>✅ Escolha do Local: Dê preferência a locais com bastante luz solar (mínimo 4-6 horas por dia).</li>
            <li>✅ Solo Saudável: Utilize uma mistura de terra rica em nutrientes e matéria orgânica para um bom crescimento.</li>
            <li>✅ Plantas Ideais: Comece com ervas e hortaliças fáceis, como manjericão, alecrim, cebolinha e alface.</li>
            <li>✅ Rega Adequada: Mantenha o solo úmido, mas sem encharcar. Regue no início da manhã ou no fim da tarde.</li>
            <li>✅ Adubação Natural: Use compostagem caseira ou adubo orgânico para fortalecer suas plantas.</li>
            <li>✅ Proteção Contra Pragas: Plante flores como cravo-de-defunto para afastar insetos naturalmente.</li>
            <li>✅ Colheita Certa: Sempre colha suas hortaliças no tempo certo para estimular um novo crescimento contínuo.</li>
          </ul>
        </div>
      </div>

      {/* Rodapé com botões de compartilhamento */}
      <footer className="mt-6 p-4 text-center shadow-lg">
        <p className="text-recifeBlue text-lg font-bold mb-4">📢 Compartilhe essas dicas com seus amigos!</p>
        <div className="flex justify-center space-x-4">
          <FacebookShareButton url={window.location.origin}>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Compartilhar no Facebook
            </button>
          </FacebookShareButton>
          <TwitterShareButton url={window.location.origin}>
            <button className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500">
              Compartilhar no X
            </button>
          </TwitterShareButton>
        </div>
      </footer>
    </div>
  );
};

export default DicasPage;
