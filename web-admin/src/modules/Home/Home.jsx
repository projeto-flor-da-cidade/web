// src/modules/home/Home.jsx

import React, { useState, useEffect } from 'react';
import flower from '../../assets/logoprincipal.svg';

export default function Home() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  return (
    // ===== A ESTRUTURA FINAL E CORRETA =====
    // Este é o contêiner da PÁGINA. Ele controla todo o seu layout interno.
    // 1. bg-[#a9af93]: Define a cor de fundo verde-oliva.
    // 2. min-h-[calc(100vh-4rem)]: Garante que a página preencha toda a altura
    //    disponível abaixo do header (altura da tela - 4rem do header).
    // 3. grid place-items-center: A forma mais robusta de centralizar um único item
    //    (o contêiner do card) tanto na vertical quanto na horizontal.
    <div className="bg-[#a9af93] min-h-[calc(100vh-4rem)] grid place-items-center p-4 sm:p-6">
      
      {/* 
        Este contêiner-filho é o que será centralizado pelo grid acima.
        - 'relative': É necessário para servir de âncora para a imagem da flor de fundo.
      */}
      <div className="relative">
      
        {/* Imagem de fundo: posicionada absolutamente em relação ao seu pai (o div acima). */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={flower}
            alt="Flor da Cidade"
            className="w-[220px] sm:w-[300px] md:w-[400px] opacity-90"
          />
        </div>

        {/* Card de boas-vindas: o conteúdo visível. */}
        <section 
          className="relative z-10 w-full max-w-4xl rounded-lg bg-[#d9d9d9]/80 backdrop-blur-sm shadow-lg p-6 text-start sm:p-8 md:p-10 animate-fade-in-up mt-50"
        >
          <h1 className="font-poppins font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 mb-2">
            Boas-vindas, {usuario?.nome || 'Admin'}!
          </h1>
          <p className="font-open-sans text-base sm:text-lg text-gray-800 leading-relaxed">
            Use o menu superior para navegar pelo Portal de Administração da plataforma Flor da Cidade.
          </p>
        </section>
        
      </div>

    </div>
  );
}