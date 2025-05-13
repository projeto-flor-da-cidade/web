// src/modules/Home/components/Header.jsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import userIcon from '../../../assets/person-circle-outline.svg'

const headerMenu = [
  {
    label: 'Serviços',
    items: [
      { name: 'Solicitações de Hortas', to: '/tela-de-descricao-de-solicitacao-hortas', enabled: true },
      { name: 'Cadastro de Cursos', to: '#', enabled: false },
    ],
  },
  {
    label: 'Consultas',
    items: [
      { name: 'Hortas Ativas', to: '#', enabled: false },
      { name: 'Cursos Ativos', to: '#', enabled: false },
      { name: 'Registros de Solicitações', to: '#', enabled: false },
      { name: 'Registros de Cursos', to: '#', enabled: false },
    ],
  },
  {
    label: 'Ferramentas',
    items: [
      { name: 'Usuários', to: '#', enabled: false },
      { name: 'Configurações', to: '#', enabled: false },
      { name: 'Relatórios', to: '#', enabled: false },
    ],
  },
]

export default function Header() {
  const location = useLocation()
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <header className="fixed inset-x-0 top-0 h-16 bg-[#d9d9d9] shadow-md z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        {/* Logo with two lines */}
        <div className="flex flex-col items-start">
          <span className="text-[#699530] font-anton font-bold text-[25px] leading-tight">
            Flor da Cidade
          </span>
          <span className="text-[#699530] font-anton font-bold text-[25px] -mt-2">
            ADMIN
          </span>
        </div>

        {/* Menu */}
        <nav className="flex items-center">
          {headerMenu.map(({ label, items }, idx) => (
            <React.Fragment key={label}>
              <div className="relative">
                {/* Main menu button */}
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className={
                    `text-[18px] font-open-sans font-bold px-26 py-2 rounded transition-colors duration-150 ` +
                    (openIndex === idx || items.some(i => i.enabled && location.pathname === i.to)
                      ? 'bg-[#c0c4b0]'
                      : 'hover:bg-[#e0e3d0]') +
                    ` focus:outline-none focus:ring-2 focus:ring-[#699530] focus:ring-offset-1`
                  }
                >
                  {label}
                </button>

                {/* Dropdown */}
                {openIndex === idx && (
                  <ul className="absolute left-0 mt-2 w-48 bg-[#d9d9d9] shadow-lg rounded-md divide-y divide-gray-400 overflow-hidden">
                    {items.map(({ name, to, enabled }) => (
                      <li key={name}>
                        {enabled ? (
                          <Link
                            to={to}
                            className={
                              `block w-full text-left px-4 py-1 text-[16px] font-open-sans font-bold transition-colors duration-150 ` +
                              (location.pathname === to ? 'bg-[#b0b49a]' : 'hover:bg-[#e0e3d0]')
                            }
                            onClick={() => setOpenIndex(null)}
                          >
                            {name}
                          </Link>
                        ) : (
                          <span className="block w-full text-left px-4 py-2 text-[16px] font-open-sans font-bold text-gray-500 opacity-50 cursor-not-allowed">
                            {name}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Separator between menus */}
              {idx < headerMenu.length - 1 && (
                <div className="h-6 w-px bg-gray-800 mx-2" />
              )}
            </React.Fragment>
          ))}

          {/* Separator before user icon */}
          <div className="h-6 w-px bg-gray-800 mx-4" />

          {/* User Icon */}
          <img src={userIcon} alt="Usuário" className="w-12 h-12" />
        </nav>
      </div>
    </header>
  )
}