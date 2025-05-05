/** postcss.config.cjs */
module.exports = {
    plugins: {
      // substitui `tailwindcss: {}` pelo plugin externo
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  };
  