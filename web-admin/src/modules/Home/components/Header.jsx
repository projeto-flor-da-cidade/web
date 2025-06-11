// src/modules/Home/components/Header.jsx
import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import userIcon from "../../../assets/person-circle-outline.svg";
// Importe o hook que criamos para fechar os menus ao clicar fora
import { useClickOutside } from "../../../hooks/useClickOutside"; 

const headerMenu = [
  {
    label: "Serviços",
    items: [
      { name: "Solicitações de Hortas", to: "/app/tela-de-solicitacao-hortas", enabled: true },
      { name: "Cadastro de Cursos",    to: "/app/tela-de-cadastro-de-curso",    enabled: true },
    ],
  },
  {
    label: "Consultas",
    items: [
      { name: "Hortas Ativas", to: "/app/tela-hortas-ativas", enabled: true },
      { name: "Cursos Ativos", to: "/app/tela-de-cursos-ativos", enabled: true },
      { name: "Registros de Solicitações", to: "#", enabled: false },
      { name: "Registros de Cursos",       to: "#", enabled: false },
    ],
  },
  {
    label: "Ferramentas",
    items: [
      { name: "Usuários",      to: "#",                  enabled: false },
      { name: "Configurações", to: "#",                  enabled: false },
      { name: "Relatórios",    to: "/app/tela-de-relatorios", enabled: true },
    ],
  },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownsRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuAndBurgerRef = useRef(null);

  useClickOutside(dropdownsRef, () => setOpenDropdown(null));
  useClickOutside(userMenuRef, () => setUserMenuOpen(false));
  useClickOutside(mobileMenuAndBurgerRef, (event) => {
    // Apenas fecha o menu mobile se o clique for fora do header inteiro
    if (!mobileMenuAndBurgerRef.current.contains(event.target)) {
        setMobileOpen(false);
    }
  });


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const NavLink = ({ to, name, onClick }) => (
    <Link
      to={to} // Todos os links aqui já são absolutos, o que é ótimo
      onClick={onClick}
      className={`block w-full text-left px-4 py-2 font-open-sans text-[16px] transition-colors duration-150 rounded ${
        location.pathname === to ? "bg-[#b0b49a] font-semibold" : "hover:bg-[#e0e3d0]"
      }`}
    >
      {name}
    </Link>
  );

  const DisabledLink = ({ name }) => (
    <span className="block px-4 py-2 font-open-sans text-[16px] text-gray-400 opacity-60 cursor-not-allowed">
      {name}
    </span>
  );

  return (
    <header ref={mobileMenuAndBurgerRef} className="fixed inset-x-0 top-0 bg-[#d9d9d9] shadow-md z-50">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================== */}
        {/* A CORREÇÃO MAIS PROVÁVEL ESTÁ AQUI */}
        {/* Transformamos o logo em um <Link> com um caminho ABSOLUTO */}
        {/* Assumindo que sua home é '/app/home'. Ajuste se for diferente. */}
        {/* ========================================================== */}
        <Link to="/app/home" className="flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#699530] rounded-sm">
          <span className="text-[#699530] font-anton font-bold text-lg sm:text-xl md:text-2xl leading-none">
            Flor da Cidade
          </span>
          <span className="text-[#699530] font-anton font-bold text-lg sm:text-xl md:text-2xl leading-none">
            ADMIN
          </span>
        </Link>

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Abrir menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center space-x-4" ref={dropdownsRef}>
          {headerMenu.map(({ label, items }, idx) => (
            <div key={label} className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                aria-haspopup="true"
                aria-expanded={openDropdown === idx}
                className={`font-open-sans font-bold text-[18px] px-4 py-2 rounded transition-colors duration-150 ${
                  items.some(i => i.enabled && location.pathname === i.to) ? "bg-[#c0c4b0]" : "hover:bg-[#e0e3d0]"
                } focus:outline-none focus:ring-2 focus:ring-[#699530] focus:ring-offset-1`}
              >
                {label}
              </button>
              <ul className={`absolute top-full left-0 mt-2 w-56 bg-white shadow-lg rounded-md divide-y divide-gray-200 z-50 transition-all duration-200 ease-out origin-top
                ${openDropdown === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                {items.map(({ name, to, enabled }) => (
                  <li key={name}>
                    {enabled ? <NavLink to={to} name={name} onClick={() => setOpenDropdown(null)} /> : <DisabledLink name={name} />}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="h-6 w-px bg-gray-600 mx-2" />

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(o => !o)} aria-haspopup="true" aria-expanded={userMenuOpen} className="focus:outline-none rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-[#699530]">
              <img src={userIcon} alt="Menu do usuário" className="w-10 h-10" />
            </button>
            <ul className={`absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50 transition-all duration-200 ease-out origin-top-right
              ${userMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 font-open-sans text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sair
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Menu mobile */}
      <div className={`md:hidden bg-[#d9d9d9] shadow-lg transition-max-height duration-300 ease-in-out overflow-hidden ${mobileOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <ul className="divide-y divide-gray-300 px-4">
          {headerMenu.map(({ label, items }) => (
            <li key={label} className="py-3">
              <p className="font-open-sans font-bold text-[18px] mb-2">{label}</p>
              <div className="pl-2 space-y-2">
                {items.map(({ name, to, enabled }) =>
                  enabled ? <NavLink key={name} to={to} name={name} onClick={() => setMobileOpen(false)} /> : <DisabledLink key={name} name={name} />
                )}
              </div>
            </li>
          ))}
          <li className="py-4 border-t border-gray-300">
            <button onClick={handleLogout} className="w-full text-left font-open-sans font-bold text-red-700 p-2 rounded hover:bg-[#e0e3d0]">
              Sair
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}