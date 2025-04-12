import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MapaHortas from './pages/MapaHortas';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DicasPage from './pages/DicasPage';
import { ThemeProvider } from './context/ThemeContext';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/maps" element={<MapaHortas />} />
          <Route path="/inscricao" element={<RegisterPage />} />
          <Route path="/dicas" element={<DicasPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
