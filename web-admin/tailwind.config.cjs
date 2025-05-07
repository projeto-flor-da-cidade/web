// tailwind.config.js
module.exports = {
  // 1) aponte pro seu JSX/TSX pra gerar todas as classes que usar
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // 2) adicione aí as suas famílias de fonte
      fontFamily: {
        anton: ['Anton', 'sans‑serif'],
        'open‑sans': ['Open Sans', 'sans‑serif'],
        poppins: ['Poppins', 'sans‑serif'],
      },
      // se precisar de mais cores (além do verde/ cinza) você pode estender aqui
      colors: {
        'verde-principal': '#699530',
        'cinza-header': '#d9d9d9',
      },
    },
  },
  plugins: [],
}
