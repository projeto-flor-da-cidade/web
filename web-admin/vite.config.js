// vite.config.js (do Front-end 2)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Define a porta aqui
  },
});