import React, { useState } from "react";
import Header from "../../Home/components/Header";
import searchIcon from "../../../assets/search-circle-outline.svg";
import pencilIcon from "../../../assets/pencil-outline.svg";
import eyeIcon from "../../../assets/eye-outline.svg";
import chevronIcon from "../../../assets/chevron-forward-outline.svg";

const sampleHortas = [
  { id: 1, name: "Seu Edinaldo", address: "Bairro Bom Jesus", status: "Ativo" },
  { id: 2, name: "Carmo", address: "Olinda", status: "Aguardando Aprovação" },
  { id: 3, name: "Pamelani", address: "Bairro Recife Antigo", status: "Aguardando Aprovação" },
  { id: 4, name: "Torradinho", address: "Bairro Ilha do Leite", status: "Ativo" },
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
    <div className="flex flex-col min-h-screen bg-gray-100 font-poppins p-4">
      <Header title="Hortas Ativas" />
      <main className="flex-1 container mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* Session 1: Header & Search */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800">
          Hortas Ativas
        </h1>
        <section className="mt-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Barra de Pesquisa */}
            <div className="relative flex-1 max-w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Buscar horta..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <img
                src={searchIcon}
                alt="Buscar"
                className="w-6 h-6 absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60"
              />
            </div>

            {/* Dropdown Ordenar Por */}
            <div className="flex-shrink-0">
              <label htmlFor="sort" className="sr-only">
                Ordenar por
              </label>
              <select
                id="sort"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="text-base font-medium bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
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
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-md p-4 shadow hover:shadow-lg transition-shadow"
              >
                <span className="text-lg sm:text-xl text-gray-700 truncate">
                  {`${horta.name} - ${horta.address}`}
                </span>
                <div className="flex items-center space-x-4 mt-2 self-end sm:mt-0 sm:self-auto">
                  <span className="text-sm text-gray-600">
                    Status: <span className="font-medium">{horta.status}</span>
                  </span>
                  <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                    <img src={pencilIcon} alt="Editar" className="w-5 h-5" />
                  </button>
                  <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                    <img src={eyeIcon} alt="Visualizar" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer: Pagination */}
        <footer className="mt-6 flex justify-center sm:justify-end items-center space-x-2">
          <span className="text-sm text-gray-600">Pag. 1 2 ...</span>
          <img src={chevronIcon} alt="Próxima" className="w-5 h-5 ml-2 cursor-pointer" />
        </footer>
      </main>
    </div>
  );
}
