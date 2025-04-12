import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const showNavbar = ['/login', '/maps', '/inscricao', '/dicas', '/about'].includes(location.pathname);

  // Lista de links da navbar
  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/login', label: 'Acesso' },
    { to: '/inscricao', label: 'Cadastro' },
    { to: '/maps', label: 'Mapas' },
    { to: '/dicas', label: 'Dicas' },
    { to: '/about', label: 'Sobre' },
  ]

  return (
    showNavbar && (
      <nav className="bg-recifeBlue text-recifeWhite p-4 shadow-lg z-50">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* Logo/Home */}
          <div className="text-lg font-bold">
            <p to="/" className="hover:text-recifeGold transition duration-300">Flor da Cidade</p>
          </div>

          {/* Ícone do menu para mobile */}
          <button 
            className="md:hidden text-white text-2xl focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Links para telas maiores */}
          <ul className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link 
                  to={link.to} 
                  className={`hover:text-recifeGold transition duration-300 ${
                    location.pathname === link.to ? 'text-recifeGold font-semibold' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu Mobile Animado */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.3 }}
            className="md:hidden bg-recifeBlue text-recifeWhite p-4 absolute w-full left-0 top-16 shadow-lg z-50"
          >
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="block text-center hover:text-recifeGold transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </nav>
    )
  );
};

export default Navbar;
