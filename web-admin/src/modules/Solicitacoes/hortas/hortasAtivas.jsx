import React, { useState } from "react";
import Header from "../../Home/components/Header";
import searchIcon from "../../../assets/search-circle-outline.svg";
import pencilIcon from "../../../assets/pencil-outline.svg";
import eyeIcon from "../../../assets/eye-outline.svg";
import chevronIcon from "../../../assets/chevron-forward-outline.svg";

const sampleHortas = [
  { id: 1, name: "Seu Edinaldo", address: "Bairro Bom Jesus", status: "Ativo" },
  { id: 2, name: "Carmo", address: "Olinda", status: "Aguardando Aprovação" },
  {
    id: 3,
    name: "Pamelani",
    address: "Bairro Recife Antigo",
    status: "Aguardando Aprovação",
  },
  {
    id: 4,
    name: "Torradinho",
    address: "Bairro Ilha do Leite",
    status: "Ativo",
  },
];

export default function HortasAtivas() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("");

  const filtered = sampleHortas.filter((h) =>
    `${h.name} - ${h.address}`.toLowerCase().includes(query.toLowerCase())
  );

  const sorted =
    sortKey === "name"
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      : filtered;

  return (
    <div className="min-h-screen bg-gray-100 font-poppins p-4">
      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* Sessão 1: Header + Pesquisa */}
        <h1 className="text-[32px] font-semibold text-gray-800">
          Hortas Ativas
        </h1>

        <section className="mt-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Barra de Pesquisa */}
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar horta..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring"
            />
            <img
              src={searchIcon}
              alt="Buscar"
              className="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2 opacity-60"
            />
          </div>

          {/* Dropdown Ordenar Por */}
          <div className="w-full sm:w-auto">
            <label htmlFor="sort" className="sr-only">
              Ordenar por
            </label>
            <select
              id="sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="w-full sm:w-auto text-[22.5px] font-medium bg-white border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring"
            >
              <option value="">Ordenar por</option>
              <option value="date">Data</option>
              <option value="name">Nome</option>
              <option value="type">Tipo</option>
            </select>
          </div>
        </section>

        {/* Sessão 2: Lista */}
        <section className="space-y-4">
          {sorted.map((horta) => (
            <div
              key={horta.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded p-4 shadow-sm"
            >
              <span className="text-[21.8px] text-gray-700 mb-2 sm:mb-0">
                {`${horta.name} - ${horta.address}`}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                <span className="text-sm text-gray-600 text-right sm:text-left">
                  Status: {horta.status}
                </span>
                <div className="flex space-x-2 justify-end">
                  <button
                    className="flex items-center px-3 py-2 bg-[#60855f] text-white rounded-md hover:bg-[#4f704d] focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled
                  >
                    <img src={pencilIcon} alt="Editar" className="w-6 h-6" />
                  </button>
                  <button
                    className="flex items-center px-3 py-2 bg-[#60855f] text-white rounded-md hover:bg-[#4f704d] focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled
                  >
                    <img src={eyeIcon} alt="Visualizar" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Rodapé: Paginação */}
        <footer className="mt-6 flex justify-end items-center">
          <span className="text-sm text-gray-600">Pag. 1 2 ...</span>
          <img src={chevronIcon} alt="Próxima" className="w-4 h-4 ml-2" />
        </footer>
      </main>
    </div>
  );
}
