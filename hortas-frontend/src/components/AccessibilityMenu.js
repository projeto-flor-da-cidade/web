import React, { useState, useContext } from 'react';
import { FaPlus, FaMinus, FaAdjust, FaSun, FaMoon, FaLightbulb } from 'react-icons/fa'; // Ícones
import { ThemeContext } from '../context/ThemeContext'; // Importa o contexto de tema global

const AccessibilityMenu = () => {
  const { isDarkMode, toggleDarkMode, isHighContrast, toggleHighContrast } = useContext(ThemeContext); // Use o contexto para acessar o estado global
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar o menu de acessibilidade
  const [fontSize, setFontSize] = useState(16); // Estado para o tamanho da fonte
  const [brightness, setBrightness] = useState(1); // Estado para o brilho (1 é o padrão)

  // Aumentar tamanho da fonte
  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
      document.body.style.fontSize = `${fontSize + 2}px`;
    }
  };

  // Diminuir tamanho da fonte
  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
      document.body.style.fontSize = `${fontSize - 2}px`;
    }
  };

  // Ajustar brilho da página
  const increaseBrightness = () => {
    if (brightness < 2) {
      setBrightness(brightness + 0.1);
      document.body.style.filter = `brightness(${brightness + 0.1})`;
    }
  };

  const decreaseBrightness = () => {
    if (brightness > 0.5) {
      setBrightness(brightness - 0.1);
      document.body.style.filter = `brightness(${brightness - 0.1})`;
    }
  };

  return (
    <div className="relative">
      {/* Botão para abrir o menu */}
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        className="text-recifeWhite font-bold text-xl"
        onClick={() => setIsOpen(!isOpen)}  // Alterna o menu
      >
        Acessibilidade
      </button>

      {/* Menu de acessibilidade */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
          <ul className="py-1 text-gray-700">
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <li className="px-4 py-2 hover:bg-gray-200 flex items-center cursor-pointer" onClick={increaseFontSize}>
              <FaPlus className="mr-2" /> Aumentar Fonte
            </li>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <li className="px-4 py-2 hover:bg-gray-200 flex items-center cursor-pointer" onClick={decreaseFontSize}>
              <FaMinus className="mr-2" /> Diminuir Fonte
            </li>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <li className="px-4 py-2 hover:bg-gray-200 flex items-center cursor-pointer" onClick={toggleHighContrast}>
              <FaAdjust className="mr-2" /> {isHighContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
            </li>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <li className="px-4 py-2 hover:bg-gray-200 flex items-center cursor-pointer" onClick={toggleDarkMode}>
              {isDarkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />} {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
            </li>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <li className="px-4 py-2 hover:bg-gray-200 flex items-center cursor-pointer" onClick={increaseBrightness}>
              <FaLightbulb className="mr-2" /> Aumentar Brilho
            </li>
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <li className="px-4 py-2 hover:bg-gray-200 flex items-center cursor-pointer" onClick={decreaseBrightness}>
              <FaLightbulb className="mr-2" /> Diminuir Brilho
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;
