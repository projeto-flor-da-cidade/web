// src/modules/SubTelasRelatorio/TelaDeRelatorios.jsx
import React, { useState, useMemo } from "react";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RELATORIOS = [
  { nome: "Rel. Horta Seu Arnaldo JUN25", tipo: "Acompanhamento", data: "xx/xx/xxxx", status: "" },
  { nome: "Rel. Horta Carpazinha MAR25", tipo: "Acolhimento",    data: "xx/xx/xxxx", status: "" },
  { nome: "Rel. Horta Santo Berço FEV25", tipo: "Acolhimento",   data: "xx/xx/xxxx", status: "" },
  { nome: "Rel. Horta Comunidade Raio de Sol FEV25", tipo: "Acompanhamento", data: "xx/xx/xxxx", status: "" },
  { nome: "Rel. Horta Vila de Kyan DEZ24", tipo: "Acolhimento",    data: "xx/xx/xxxx", status: "" },
  { nome: "Rel. Horta Carpazinha MAR25", tipo: "Acolhimento",    data: "xx/xx/xxxx", status: "" },
  { nome: "Modelo - Horta Acompanhamento", tipo: "Modelo",       data: "xx/xx/xxxx", status: "" },
  { nome: "Rel. Horta Comunidade Raio de Sol FEV25", tipo: "Acolhimento", data: "xx/xx/xxxx", status: "" }
];

const OPTIONS = [
  { label: "Data",   key: "data" },
  { label: "Nome",   key: "nome" },
  { label: "Tipo",   key: "tipo" },
  { label: "Status", key: "status" }
];

export default function TelaDeRelatorios() {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [sortKey,     setSortKey]     = useState("");

  // filtra pelo termo de busca
  const filteredRelatorios = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return RELATORIOS;
    return RELATORIOS.filter(rel =>
      [rel.nome, rel.tipo, rel.data, rel.status]
        .some(field => field.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  // ordena conforme sortKey
  const sortedRelatorios = useMemo(() => {
    if (!sortKey) return filteredRelatorios;
    return [...filteredRelatorios].sort((a, b) => {
      if (sortKey === "data") {
        // assume dd/mm/yyyy
        const parseDate = d => new Date(d.split("/").reverse().join("-"));
        return parseDate(a.data) - parseDate(b.data);
      }
      return a[sortKey].toLowerCase().localeCompare(b[sortKey].toLowerCase());
    });
  }, [sortKey, filteredRelatorios]);

  return (
    <div className="min-h-screen bg-[#A9AF93] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-[#E6E3DC] rounded-lg shadow-md p-6">
        {/* Cabeçalho com botão de criar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="font-poppins text-3xl font-semibold text-gray-800">
            Relatórios
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowOptions(o => !o)}
              className="bg-[#699530] hover:bg-[#587e29] text-white p-2 rounded-full transition"
            >
              <FaPlus className="w-4 h-4" />
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-10 p-2 space-y-2">
                <button
                  onClick={() => navigate("/app/criar-relatorio-acolhimento")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Criar relatório de acolhimento
                </button>
                <button
                  onClick={() => navigate("/app/criar-relatorio-acompanhamento")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Criar relatório de acompanhamento
                </button>
                <button
                  onClick={() => navigate("/app/criar-modelo-relatorio")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Criar modelo de relatório
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Busca e ordenação */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center bg-white border rounded px-3 py-2 w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Buscar relatório..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-grow outline-none font-openSans text-sm"
            />
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
              />
            </svg>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-openSans text-sm">
            <span className="font-semibold text-gray-700">Ordenar por:</span>
            {OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                className={`px-2 py-1 rounded ${
                  sortKey === opt.key
                    ? "underline font-semibold text-[#699530]"
                    : "text-gray-700 hover:underline"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de cartões de relatório */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRelatorios.length > 0 ? (
            sortedRelatorios.map((rel, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between bg-white p-4 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">{rel.nome}</p>
                  <p className="text-gray-500 text-sm">
                    {rel.tipo} – {rel.data}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Status: <span className="font-medium">{rel.status || "—"}</span>
                  </p>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button className="p-2 bg-[#ECECE6] hover:bg-gray-200 rounded-full">
                    <FaEye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigate("/app/editar-relatorio")}
                    className="p-2 bg-[#ECECE6] hover:bg-gray-200 rounded-full"
                  >
                    <FaEdit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">
              Nenhum relatório encontrado.
            </p>
          )}
        </div>

        {/* Paginação estática */}
        <div className="mt-6 flex justify-end items-center space-x-2 text-sm font-medium">
          <span>Pág.</span>
          <button className="px-2 py-1 bg-[#699530] text-white rounded">1</button>
          <button className="px-2 py-1 bg-[#ECECE6] text-gray-700 rounded hover:bg-gray-200">
            2
          </button>
          <span>…</span>
        </div>
      </div>
    </div>
  );
}
