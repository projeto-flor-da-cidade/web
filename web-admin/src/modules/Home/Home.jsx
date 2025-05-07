// src/modules/Home/Home.jsx
import React from 'react'
import Header from './components/Header'
import flower from '../../assets/logoprincipal.svg'

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header fixo */}
      <Header />

      {/* Main */}
      <main className="relative flex-1 bg-[#a9af93] pt-16 overflow-auto">
        {/* Flower como background central */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={flower}
            alt="Flor da Cidade"
            className="w-[300px] md:w-[400px] lg:w-[400px] opacity-90"
          />
        </div>

        {/* Card de boas‑vindas */}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div
            className="p-9 rounded-lg max-w-2xl w-full"
            style={{
              backgroundColor: '#d9d9d9cc', // cor com leve transparência (80%)
              width: '70%',
              maxWidth: '1271px',
              height: 'auto',
            }}
          >
            <h2 className="font-poppins font-bold text-[18px] text-gray-900 mb-2 text-left">
              Boas vindas!!
            </h2>
            <p className="font-poppins text-[18px] text-gray-900 text-left">
              Use o menu Superior para navegar pelo Portal de Administração da plataforma Flor da Cidade!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
