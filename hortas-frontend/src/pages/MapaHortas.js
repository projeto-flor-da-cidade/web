/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Botão de Centralização
function CentralizarBotao({ center }) {
  const map = useMap();

  const handleClick = () => {
    if (center) {
      map.setView(center, 13);
    } else {
      alert('Localização do usuário não disponível.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 md:bottom-24 md:right-10 bg-recifeBlue text-white px-3 py-2 text-sm md:text-base rounded shadow hover:bg-recifeGold z-50"
    >
      📍 Centralizar
    </button>
  );
}

function MapaHortas() {
  const [hortas, setHortas] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Erro ao acompanhar a localização: ", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const fetchHortas = async () => {
    try {
      const response = await axios.get('/api/hortas');
      setHortas(response.data);
    } catch (error) {
      console.error("Erro ao buscar hortas:", error);
    }
  };

  useEffect(() => {
    fetchHortas();
    const intervalId = setInterval(() => {
      fetchHortas();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <input
        type="text"
        placeholder="Filtrar por tipo"
        onChange={(e) => setFiltro(e.target.value)}
        className="border p-2 mb-4 w-full max-w-sm"
      />

      <div className="w-full md:w-3/4 lg:w-2/3 xl:w-1/2 relative">
        <div className="bg-white p-4 rounded-md shadow-md relative z-10">
          <h2 className="text-recifeBlue text-3xl font-bold mb-4 text-center">Mapa das Hortas</h2>

          <MapContainer
            center={userLocation || [-8.04951, -34.87826]}
            zoom={13}
            style={{ height: '70vh', width: '100%', minHeight: '400px', marginTop: '10px' }}
            className="relative"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {userLocation && <CentralizarBotao center={userLocation} />}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>Você está aqui!</Popup>
              </Marker>
            )}
            {hortas
              .filter((horta) => horta.tipo.toLowerCase().includes(filtro.toLowerCase()))
              .map((horta, index) => (
                <Marker key={horta.id || index} position={[horta.latitude, horta.longitude]}>
                  <Popup>
                    <strong>{horta.nome}</strong>
                    <br />
                    {horta.tipo}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="bg-recifeBlue text-recifeWhite p-6 text-center mt-8 w-full">
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
    </div>
  );
}

export default MapaHortas;
