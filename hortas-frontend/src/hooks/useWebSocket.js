import { useEffect } from 'react';

const useWebSocket = (onMessage) => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:5000'); // URL do WebSocket

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return () => socket.close();
  }, [onMessage]);
};

export default useWebSocket;