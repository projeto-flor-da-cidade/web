import React, { useState } from 'react';
import img1 from '../../assets/ordem.jpg';
import img2 from '../../assets/ordem2.jpg';
import img3 from '../../assets/ordem3.jpg';
import calendarIcon from '../../assets/calendar-outline.svg';
import checkIcon from '../../assets/checkmark-circle-outline.svg';
import closeIcon from '../../assets/close-outline.svg';
import searchIcon from '../../assets/search-circle-outline.svg';

export default function TelaDeDescricaoDeSolicitacaoHortas() {
  const images = [img1, img2, img3];
  const [current, setCurrent] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  const prevImage = () => setCurrent((current - 1 + images.length) % images.length);
  const nextImage = () => setCurrent((current + 1) % images.length);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 font-poppins pt-16">
      <div className="container mx-auto px-4 py-6">
        {/* Título abaixo do Header fixo */}
        <h1 className="text-[32.3px] font-semibold text-center md:text-left mb-8">
          Request - Horta Seu Arnaldo - Bairro Bom Jesus
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Coluna esquerda: seções */}
          <div className="space-y-10 text-sm">
            {/* Informações do usuário */}
            <section>
              <h2 className="font-bold text-lg mb-4">Informações do usuário</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div><strong>User:</strong> Seu Arnaldo Fritz</div>
                <div><strong>nome completo:</strong> ____________</div>
                <div><strong>Email:</strong> ____________</div>
                <div><strong>telefone:</strong> ____________</div>
                <div><strong>Escolaridade:</strong> ____________</div>
                <div><strong>Função/Cargo na unidade:</strong> ____________</div>
              </div>
            </section>

            {/* Informações da Horta */}
            <section>
              <h2 className="font-bold text-lg mb-4">Informações da Horta</h2>
              <ul className="list-none space-y-2">
                <li><strong>Tipo de Horta:</strong> Escolar/Saúde/Institucionais/Comunitárias</li>
                <li><strong>endereço da área de produção:</strong> ____________</li>
                <li><strong>classificação da área:</strong> ____________</li>
                <li><strong>tamanho da área prevista (m²):</strong> ____________</li>
                <li><strong>Caracterização/tipo da área:</strong> ____________</li>
                <li><strong>área produtiva no recife:</strong> sim/nao</li>
                <li><strong>Quantidade de pessoas interessadas:</strong> ____________</li>
                <li><strong>data de solicitação:</strong> 28/11/2025</li>
                <li><strong>Possui parceria:</strong> S/N</li>
              </ul>
            </section>

            {/* Informações Tipo de Horta */}
            <section>
              <h2 className="font-bold text-lg mb-4">Informações Tipo de Horta</h2>
              <ul className="list-none space-y-2">
                <li><strong>Tipo de Horta:</strong> Escolar/Saúde/Institucionais/Comunitárias</li>
                <li className="mt-2"><strong>Comunitária:</strong></li>
                <li>qnt. participantes: ____________</li>
                <li>instituição apoiadora: não / “Texto do usuário”</li>
                <li>CAD único usuário: não / UserCadUniq</li>
                <li>responsável pela comunidade ou sucessores: ____________</li>
                <li className="mt-4"><strong>Saúde:</strong></li>
                <li>Tipo de público: (CAPS/ILPS)</li>
                <li className="mt-4"><strong>Escolar:</strong></li>
                <li>Série da turma atendida: (Jardim até ensino fundamental)</li>
              </ul>
            </section>
          </div>

          {/* Coluna direita: carousel + texto */}
          <div className="w-full">
            <div className="relative w-full rounded-lg overflow-hidden shadow-md">
              <img
                src={images[current]}
                alt={`Horta ${current + 1}`}
                className="w-full h-64 object-cover"
              />
              {/* Expand icon */}
              <button
                onClick={openModal}
                className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1"
              >
                <img src={searchIcon} alt="Expandir" className="w-6 h-6" />
              </button>
              {/* Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2"
              >←</button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 rounded-full p-2"
              >→</button>
            </div>
            {/* Dots */}
            <div className="flex justify-center mt-2 space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-3 h-3 rounded-full ${current === idx ? 'bg-green-600' : 'bg-white border border-gray-400'}`}
                />
              ))}
            </div>
            {/* Texto */}
            <h2 className="font-semibold text-[16px] mt-4">Características do grupo interessado:</h2>
            <div className="mt-2 w-full bg-white p-4 rounded-lg border-2 border-gray-400 text-[16px] h-80 overflow-y-auto">
              {/* Conteúdo */}
              O "Suvaco Seco" era mais do que um simples bar; era um ponto de encontro e refúgio para os Gaudérios Abutres, um grupo de motoqueiros com quem Ivete tinha uma forte ligação desde a fundação do grupo. Ela era considerada uma amiga leal e uma figura importante para eles.

                O nome peculiar do bar, "Suvaco Seco", não tem uma explicação detalhada dentro da narrativa, mas ele evoca uma imagem rústica e talvez um tanto inusitada, condizente com a atmosfera de um bar de motoqueiros em uma cidade menor. O nome se tornou icônico entre os fãs de "Ordem Paranormal", representando esse local específico e a personagem da Ivete.

            Após os eventos traumáticos ocorridos em Carpazinha, e restando apenas Arthur Cervero como sua família, Ivete se junta ao grupo da Ordo Realitas. O "Suvaco Seco" original em Carpazinha deixa de ser seu ponto principal, mas o nome é posteriormente homenageado quando a Ordo Realitas estabelece sua base secreta em São Paulo sob um bar com o mesmo nome.
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-dark-300">
          <h3 className="font-semibold text-lg mb-4">Opções de solicitação</h3>
          <p className="text-sm mb-4"><strong>Data de visita:</strong> não definida</p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
              <img src={calendarIcon} alt="Calendário" className="w-5 h-5 mr-2" />
              Solicitar data de visita
            </button>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              <img src={checkIcon} alt="Aprovar" className="w-5 h-5 mr-2" />
              Aprovar solicitação
            </button>
            <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
              <img src={closeIcon} alt="Recusar" className="w-5 h-5 mr-2" />
              Recusar solicitação
            </button>
          </div>
        </footer>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-3xl"
          >&times;</button>
          <img src={images[current]} alt="Ampliada" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
