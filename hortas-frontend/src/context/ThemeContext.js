// src/context/ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Toggle High Contrast
  const toggleHighContrast = () => {
    setIsHighContrast((prevMode) => !prevMode);
  };

  // Apply classes to the body element based on state
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isDarkMode, isHighContrast]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, isHighContrast, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
};
