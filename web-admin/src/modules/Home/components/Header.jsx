// src/modules/Home/components/Header.jsx
import React from 'react'
import userIcon from '../../../assets/person-circle-outline.svg'

const headerMenu = [
  { label: 'Serviços', items: ['Solicitações de Hortas', 'Cadastro de Cursos'] },
  { label: 'Consultas', items: ['Hortas Ativas', 'Cursos Ativos', 'Registros de Solicitações', 'Registros de Cursos'] },
  { label: 'Ferramentas', items: ['Usuários', 'Configurações', 'Relatórios'] },
]

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 h-16 bg-[#d9d9d9] shadow-md z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-2">
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
              <div className="relative group">
                <button className="text-[18px] font-open-sans font-bold text-[#333] px-30 py-2 hover:bg-[#d9d9d9] rounded transition">
                  {label}
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block">
                  <ul className="bg-[#d9d9d9] shadow-lg rounded-md divide-y divide-gray-400">
                    {items.map(item => (
                      <li key={item}>
                        <button
                          disabled
                          className="w-75 text-left px-8 py-2 text-[16px] font-open-sans font-bold text-[#333] hover:bg-[#d9d9d9]"
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Separador entre menus */}
              {idx < headerMenu.length - 1 && (
                <div className="h-10 w-px bg-gray-800 mx-2" />
              )}
            </React.Fragment>
          ))}

          {/* Ícone de usuário (sem separador extra) */}
          <img src={userIcon} alt="Usuário" className="w-12 h-12 ml-4" />
        </nav>
      </div>
    </header>
  )
}
