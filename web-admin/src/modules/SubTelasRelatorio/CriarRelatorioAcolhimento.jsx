import React from 'react';

export default function CriarRelatorioAcompanhamento() {
  return (
    <div className="bg-[#B4B89F] min-h-screen flex justify-center items-start pt-20">
      <div className="w-full max-w-5xl bg-[#E6E3DC] border border-[#A0A582] rounded-md shadow p-4">
        <h1 className="text-2xl font-poppins text-black font-normal mb-4">
          Criar relatório de Acolhimento
        </h1>
        <textarea
          placeholder="Digite aqui o conteúdo do relatório de Acolhimento..."
          className="w-full h-[80vh] bg-[#E6E3DC] border border-gray-400 rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#A0A582] text-black font-poppins text-base"
        />
      </div>
    </div>
  );
}