import React from 'react'
import flower from '../../assets/logoprincipal.svg'

export default function Home() {
  return (
    <main className="relative flex-1 bg-[#a9af93] pt-16 overflow-auto">
      {/* Imagem central */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src={flower}
          alt="Flor da Cidade"
          className="w-[220px] sm:w-[300px] md:w-[400px] opacity-90 transition-all duration-300"
        />
      </div>

      {/* Card de boas-vindas */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 py-10 sm:py-20">
        <div
          className="rounded-lg w-full sm:max-w-2xl lg:max-w-4xl p-6 sm:p-9 bg-[#d9d9d9]/80 backdrop-blur-sm shadow-md"
        >
          <h2 className="font-poppins font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-4 text-center sm:text-left">
            Boas vindas!!
          </h2>
          <p className="font-poppins text-base sm:text-lg md:text-xl text-gray-900 text-center sm:text-left leading-relaxed">
            Use o menu superior para navegar pelo Portal de Administração da plataforma Flor da Cidade!
          </p>
        </div>
      </div>
    </main>
  )
}
