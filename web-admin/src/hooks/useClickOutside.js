// src/hooks/useClickOutside.js
import { useEffect } from 'react';

export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Não faz nada se o clique for dentro do elemento ref ou seus descendentes
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}