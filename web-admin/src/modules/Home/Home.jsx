import React from 'react';
import flower from '../../assets/logoprincipal.svg';

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen pt-16 bg-[#a9af93]">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={flower}
          alt="Flor da Cidade"
          className="w-[300px] sm:w-[400px] md:w-[500px]"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 opacity-80">
        <div className="rounded-lg w-full sm:max-w-2xl lg:max-w-4xl p-6 sm:p-9 bg-[#d9d9d9]/80 backdrop-blur-md shadow-md">
          <h2 className="font-poppins font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-4 text-left">
            Boas vindas!!
          </h2>
          <p className="font-poppins text-base sm:text-lg md:text-xl text-gray-900 text-left leading-relaxed">
            Use o menu superior para navegar pelo Portal de Administração da plataforma Flor da Cidade!
          </p>
        </div>
      </div>
    </main>
  );
}
