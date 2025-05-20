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
  // ... outros itens
];

export default function HortasAtivas() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("");

  // Filtra pelas hortas que contêm a query
  const filtered = sampleHortas.filter((h) =>
    `${h.name} - ${h.address}`.toLowerCase().includes(query.toLowerCase())
  );

  // Ordena apenas pelo nome quando selecionado
  const sorted =
    sortKey === "name"
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      : filtered;

  return (
    <div className="min-h-screen bg-gray-100 font-poppins p-4 flex flex-col">
      <main className="container mx-auto p-6 pt-20">
        {/* Session 1: Header & Search */}
        <h1 className="text-[32px] font-semibold text-gray-800">
          Hortas Ativas
        </h1>
        <section className="mb-6">
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {/* Barra de Pesquisa */}
            <div className="relative flex-1 max-w-xs">
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
            <div>
              <label htmlFor="sort" className="sr-only">
                Ordenar por
              </label>
              <select
                id="sort"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="text-[22.5px] font-medium bg-white border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring"
              >
                <option value="">Ordenar por</option>
                <option value="date">Data</option>
                <option value="name">Nome</option>
                <option value="type">Tipo</option>
              </select>
            </div>
          </div>
        </section>

        {/* Session 2: List */}
        <section className="flex-1 overflow-auto">
          <div className="space-y-4">
            {sorted.map((horta) => (
              <div
                key={horta.id}
                className="flex justify-between items-center bg-white rounded p-4 shadow-sm"
              >
                <span className="text-[21.8px] text-gray-700">{`${horta.name} - ${horta.address}`}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Status: {horta.status}
                  </span>
                  <button className="flex items-center px-3 py-3 bg-[#60855f] text-white rounded-md transition-colors duration-200 hover:bg-[#4f704d] focus:outline-none focus:ring-2 focus:ring-green-500">
                    <img src={pencilIcon} alt="Editar" className="w-6 h-6" />
                  </button>
                  <button className="flex items-center px-3 py-3 bg-[#60855f] text-white rounded-md transition-colors duration-200 hover:bg-[#4f704d] focus:outline-none focus:ring-2 focus:ring-green-500">
                    <img src={eyeIcon} alt="Visualizar" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer: Pagination */}
        <footer className="mt-6 flex justify-end items-center">
          <span className="text-sm text-gray-600">Pag. 1 2 ...</span>
          <img src={chevronIcon} alt="Próxima" className="w-4 h-4 ml-2" />
        </footer>
      </main>
    </div>
  );
}
