import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockRequests = [
  { id: 1, title: 'Request - Horta Seu Arnaldo - Bairro Bom Jesus', date: '2025-05-01', type: 'Comunitária' },
  { id: 2, title: 'Request - Horta do Carmo - Olinda', date: '2025-04-20', type: 'Escolar' },
  { id: 3, title: 'Request - Horta Pamelani - Bairro Recife Antigo', date: '2025-03-15', type: 'Comunitária' },
  { id: 4, title: 'Request - Horta Torradinho - Bairro Ilha do Leite', date: '2025-02-28', type: 'Doméstica' },
]

export default function TelaDeSolicitacaoHortas() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('')

  const filtered = mockRequests
    .filter(r => r.title.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      if (!sortKey) return 0
      return String(a[sortKey]).localeCompare(String(b[sortKey]))
    })

  const options = [
    { label: 'Data', key: 'date' },
    { label: 'Nome', key: 'title' },
    { label: 'Tipo', key: 'type' },
  ]

  return (
    <main className="relative flex-1 bg-[#A9AD99] pt-16 p-4 min-h-screen">
      <div className="mx-auto w-full max-w-7xl bg-[#E6E3DC] rounded-lg p-4 sm:p-6 shadow">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="font-openSans font-bold text-xl text-gray-900 text-center md:text-left">
            Hortas Ativas
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-4">
            {/* Campo de busca */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded border border-gray-400 font-openSans text-sm focus:outline-none focus:ring-2 focus:ring-[#6D9435]"
              />
              <svg
                className="w-4 h-4 text-gray-600 absolute left-2 top-1/2 transform -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.4-5.15A7 7 0 1111 4a7 7 0 017 7z" />
              </svg>
            </div>

            {/* Filtros de ordenação */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 font-openSans text-sm">
              <span className="font-semibold underline">Ordenar por</span>
              <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                  <span
                    key={opt.key}
                    onClick={() => setSortKey(opt.key)}
                    className={`cursor-pointer ${sortKey === opt.key ? 'underline font-semibold' : 'text-gray-700'}`}
                  >
                    {opt.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lista responsiva */}
        <ul className="space-y-3">
          {filtered.map(req => (
            <li
              key={req.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded p-3 gap-2"
            >
              <span className="font-openSans text-base text-gray-800">
                {req.title}
              </span>
              <button
                onClick={() => navigate('/tela-de-descricao-de-solicitacao-hortas', { state: { id: req.id } })}
                className="self-end sm:self-auto p-2 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D9435]"
                aria-label="Visualizar detalhes"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}


