import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', matricula: '', setor: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(credentials.email);
    const isMatriculaValid = /^[0-9]*$/.test(credentials.matricula);

    if (!isEmailValid) {
      setErrorMessage('E-mail inválido.');
      return false;
    }
    if (!isMatriculaValid) {
      setErrorMessage('Matrícula deve conter apenas números.');
      return false;
    }
    return true;
  };

  if (isAuthenticated) {
    return <div>Bem-vindo, {user.name}</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    try {
      const response = await api.post('/login', credentials);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setErrorMessage('Falha ao realizar login. Verifique suas credenciais.');
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleConectaRecifeClick = () => {
    window.open('https://conectarecife.recife.pe.gov.br/', '_blank');
  };

  const handleGovBrClick = () => {
    window.open('https://sso.acesso.gov.br/login?client_id=portal-logado.estaleiro.serpro.gov.br&authorization_id=1928af70229', '_blank');
  };

  return (
    <>
    <div className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center px-4" style={{ backgroundImage: "url('/images/backimage.png')" }}>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-4 z-10">
        <h2 className="text-2xl font-bold text-recifeBlue mb-4">Login</h2>
        
        <label htmlFor="email" className="block mb-2 font-bold text-recifeBlue">E-mail</label>
        <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" className="p-3 w-full rounded-md border-2" />

        <label htmlFor="password" className="block mb-2 font-bold text-recifeBlue">Senha</label>
        <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Senha" className="p-3 w-full rounded-md border-2" />

        <label htmlFor="matricula" className="block mb-2 font-bold text-recifeBlue">Matrícula</label>
        <input type="text" name="matricula" value={credentials.matricula} onChange={handleChange} placeholder="Matrícula" className="p-3 w-full rounded-md border-2" />

        <button type="submit" className="w-full bg-recifeBlue text-recifeWhite px-6 py-3 rounded-lg shadow-md hover:bg-recifeGold hover:text-recifeBlue transition duration-300">
          Login
        </button>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="text-center mt-6">
          <p className="text-2xl font-bold text-recifeBlue mb-2">Logar com:</p>
          <button onClick={handleConectaRecifeClick} className="bg-recifeBlue text-recifeWhite px-4 py-2 m-2 rounded-lg hover:bg-recifeGold hover:text-recifeBlue">Conecta Recife</button>
          <button onClick={handleGovBrClick} className="bg-recifeBlue text-recifeWhite px-4 py-2 m-2 rounded-lg hover:bg-recifeGold hover:text-recifeBlue">Gov.br</button>
        </div>
      </form>
    </div>

    <footer className="w-full bg-recifeBlue text-recifeWhite text-center p-4 mt-18 bottom-0">
        <p>&copy; 2025 Prefeitura do Recife</p>
        <div className="flex justify-center space-x-4 mt-4">
          {[ 
            { href: "https://www.facebook.com/prefeituradorecife", src: "Facebook_logo.png", alt: "Facebook" },
            { href: "https://x.com/prefrecife", src: "x.png", alt: "X" },
            { href: "https://www.instagram.com/prefeiturarecife/", src: "instagram.jpeg", alt: "Instagram" },
            { href: "https://www.youtube.com/channel/UCxMRq-Mv3UimnqOl6aRrM6Q", src: "youtube.png", alt: "YouTube" },
            { href: "https://www.flickr.com/photos/prefeituradorecife/", src: "flickr.png", alt: "Flickr" },
          ].map(({ href, src, alt }) => (
            <a key={alt} href={href} target="_blank" rel="noopener noreferrer">
              <img src={`${process.env.PUBLIC_URL}/images/${src}`} alt={alt} className="w-6 h-6" />
            </a>
          ))}
        </div>
      </footer>
    </>
  );
};

export default LoginPage;
