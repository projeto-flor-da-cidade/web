import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import userIcon from "../../../assets/person-circle-outline.svg";

const headerMenu = [
  {
    label: "Serviços",
    items: [
      { name: "Solicitações de Hortas", to: "tela-de-solicitacao-hortas", enabled: true },
      { name: "Cadastro de Cursos", to: "tela-de-cadastro-de-curso", enabled: true },
    ],
  },
  {
    label: "Consultas",
    items: [
      { name: "Hortas Ativas", to: "tela-hortas-ativas", enabled: true },
      { name: "Cursos Ativos", to: "tela-de-cursos-ativos", enabled: true },
      { name: "Registros de Solicitações", to: "#", enabled: false },
      { name: "Registros de Cursos", to: "#", enabled: false },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { name: "Usuários", to: "#", enabled: false },
      { name: "Configurações", to: "#", enabled: false },
      { name: "Relatórios", to: "#", enabled: false },
    ],
  },
];

export default function Header() {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [openIndex, setOpenIndex] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 h-16 bg-[#d9d9d9] shadow-md z-50">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex flex-col items-start">
          <span className="text-[#699530] font-anton font-bold text-lg sm:text-xl md:text-2xl lg:text-[25px] leading-tight">
            Flor da Cidade
          </span>
          <span className="text-[#699530] font-anton font-bold text-lg sm:text-xl md:text-2xl lg:text-[25px] -mt-1">
            ADMIN
          </span>
        </div>

        {/* Menu */}
        <nav className="flex items-center overflow-x-auto sm:overflow-x-visible whitespace-nowrap space-x-1 sm:space-x-4">
          {headerMenu.map(({ label, items }, idx) => (
            <React.Fragment key={label}>
              <div className="relative">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className={
                    `text-sm sm:text-[18px] font-open-sans font-bold px-2 sm:px-4 md:px-6 py-1 sm:py-2 rounded transition-colors duration-150 ` +
                    (openIndex === idx ||
                    items.some(
                      (i) => i.enabled && location.pathname.endsWith(i.to)
                    )
                      ? "bg-[#c0c4b0]"
                      : "hover:bg-[#e0e3d0]") +
                    ` focus:outline-none focus:ring-2 focus:ring-[#699530] focus:ring-offset-1`
                  }
                >
                  {label}
                </button>

                {openIndex === idx && (
                  <ul className="absolute left-0 mt-2 w-44 sm:w-48 bg-[#d9d9d9] shadow-lg rounded-md divide-y divide-gray-400 overflow-hidden z-50">
                    {items.map(({ name, to, enabled }) => (
                      <li key={name}>
                        {enabled ? (
                          <Link
                            to={to}
                            className={
                              `block w-full text-left px-4 py-1 text-[14px] sm:text-[16px] font-open-sans font-bold transition-colors duration-150 ` +
                              (location.pathname.endsWith(to)
                                ? "bg-[#b0b49a]"
                                : "hover:bg-[#e0e3d0]")
                            }
                            onClick={() => setOpenIndex(null)}
                          >
                            {name}
                          </Link>
                        ) : (
                          <span className="block w-full text-left px-4 py-2 text-[14px] sm:text-[16px] font-open-sans font-bold text-gray-500 opacity-50 cursor-not-allowed">
                            {name}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {idx < headerMenu.length - 1 && (
                <div className="h-6 w-px bg-gray-800 mx-2 hidden sm:block" />
              )}
            </React.Fragment>
          ))}

          {/* User Icon com Dropdown */}
          <div className="h-6 w-px bg-gray-800 mx-2 hidden sm:block" />
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center focus:outline-none"
            >
              <img
                src={userIcon}
                alt="Usuário"
                className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
              />
            </button>

            {userMenuOpen && (
              <ul className="absolute right-0 mt-2 w-40 bg-[#d9d9d9] shadow-lg rounded-md divide-y divide-gray-400 z-50">
                <li>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-[14px] sm:text-[16px] font-open-sans font-bold hover:bg-[#e0e3d0] transition-colors duration-150"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
