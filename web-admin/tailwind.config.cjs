// tailwind.config.cjs

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Suas fontes e cores personalizadas continuam aqui
      fontFamily: { 
        anton: ['Anton', 'sans-serif'], 
        openSans: ['Open Sans', 'sans-serif'], 
        poppins: ['Poppins', 'sans-serif'] 
      },
      colors: { 
        'verde-principal': '#699530', 
        'cinza-header': '#d9d9d9' 
      },

      // ADICIONE ESTAS CONFIGURAÇÕES DE ANIMAÇÃO
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      }
    }
  },
  plugins: [],
};