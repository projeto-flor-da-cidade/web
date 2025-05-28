import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import userIcon from "../../../assets/person-circle-outline.svg";

const headerMenu = [
  {
    label: "Serviços",
    items: [
      { name: "Solicitações de Hortas", to: "/tela-de-solicitacao-hortas", enabled: true },
      { name: "Cadastro de Cursos", to: "/tela-de-cadastro-de-curso", enabled: true },
    ],
  },
  {
    label: "Consultas",
    items: [
      { name: "Hortas Ativas", to: "/tela-hortas-ativas", enabled: true },
      { name: "Cursos Ativos", to: "/tela-de-cursos-ativos", enabled: true },
      { name: "Registros de Solicitações", to: "#", enabled: false },
      { name: "Registros de Cursos", to: "#", enabled: false },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { name: "Usuários", to: "#", enabled: false },
      { name: "Configurações", to: "#", enabled: false },
      { name: "Relatórios", to: "/tela-de-relatorios", enabled: true },
    ],
  },
];

export default function Header() {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <header className="fixed inset-x-0 top-0 bg-[#d9d9d9] shadow-md z-50">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex flex-col">
          <span className="text-[#699530] font-anton font-bold text-lg sm:text-xl md:text-2xl">
            Flor da Cidade
          </span>
          <span className="text-[#699530] font-anton font-bold text-lg sm:text-xl md:text-2xl -mt-1">
            ADMIN
          </span>
        </div>

        {/* Hamburger para mobile */}
        <button
          className="block sm:hidden text-gray-700 focus:outline-none"
          onClick={toggleMobile}
        >
          {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Menu desktop */}
        <nav className="hidden sm:flex items-center space-x-4">
          {headerMenu.map(({ label, items }, idx) => (
            <div key={idx} className="relative">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className={`font-open-sans font-bold text-[18px] px-4 py-2 rounded transition-colors duration-150 ${
                  openIndex === idx || items.some(i => i.enabled && location.pathname === i.to)
                    ? 'bg-[#c0c4b0]'
                    : 'hover:bg-[#e0e3d0]'
                } focus:outline-none focus:ring-2 focus:ring-[#699530] focus:ring-offset-1`}
              >
                {label}
              </button>
              {openIndex === idx && (
                <ul className="absolute top-full left-0 mt-2 bg-[#d9d9d9] shadow-lg rounded-md divide-y divide-gray-300 w-48">
                  {items.map(({ name, to, enabled }) => (
                    <li key={name}>
                      {enabled ? (
                        <Link
                          to={to}
                          onClick={() => setOpenIndex(null)}
                          className={`block px-4 py-2 font-open-sans text-[16px] transition-colors duration-150 ${
                            location.pathname === to ? 'bg-[#b0b49a]' : 'hover:bg-[#e0e3d0]'
                          }`}
                        >
                          {name}
                        </Link>
                      ) : (
                        <span className="block px-4 py-2 font-open-sans text-[16px] text-gray-400 opacity-50 cursor-not-allowed">
                          {name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {/* Ícone de usuário */}
          <img src={userIcon} alt="Usuário" className="w-10 h-10 ml-4" />
        </nav>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="sm:hidden bg-[#d9d9d9] shadow-md">
          <ul className="divide-y divide-gray-300">
            {headerMenu.map(({ label, items }, idx) => (
              <li key={idx} className="px-4 py-3">
                <p className="font-open-sans font-bold text-[18px] mb-2">{label}</p>
                {items.map(({ name, to, enabled }) => (
                  enabled ? (
                    <Link
                      key={name}
                      to={to}
                      onClick={toggleMobile}
                      className={`block py-1 font-open-sans text-[16px] ${
                        location.pathname === to ? 'text-[#699530]' : 'text-gray-700'
                      }`}
                    >
                      {name}
                    </Link>
                  ) : (
                    <span
                      key={name}
                      className="block py-1 font-open-sans text-[16px] text-gray-400 cursor-not-allowed"
                    >
                      {name}
                    </span>
                  )
                ))}
              </li>
            ))}
            <li className="flex justify-center py-4">
              <img src={userIcon} alt="Usuário" className="w-12 h-12" />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}