# 🌻 Flor da Cidade – Web Admin

Este repositório contém o **painel administrativo** (`web-admin`) do projeto **Flor da Cidade**, desenvolvido com foco em tecnologias modernas para interfaces web.

## ✨ Descrição

**Parte web-admin do projeto Flor da Cidade**, utilizando:
- [React.js](https://reactjs.org/) – Biblioteca para criação de interfaces declarativas.
- [Vite](https://vitejs.dev/) – Build tool ultrarrápida para projetos front-end.
- [Tailwind CSS](https://tailwindcss.com/) – Framework CSS utilitário para estilização rápida.
- [Axios](https://axios-http.com/) – Cliente HTTP baseado em Promises.
- [React Router DOM](https://reactrouter.com/) – Roteamento SPA (Single Page Application).
- [Context API] – Gerenciamento leve de estado global.
- [React Icons](https://react-icons.github.io/react-icons/) – Biblioteca de ícones SVG integrados ao React.

## 📁 Estrutura de Pastas

```bash
Web/
└── web-admin/
    ├── public/              # Arquivos públicos (favicon, index.html)
    ├── src/
    │   ├── assets/          # Imagens, logos, ícones, etc.
    │   ├── components/      # Componentes reutilizáveis (botões, modais, inputs...)
    │   ├── contexts/        # Contexts de estado global (ex: AuthContext)
    │   ├── hooks/           # Hooks personalizados (ex: useAuth, useFetch)
    │   ├── modules/         # Funcionalidades principais da aplicação (páginas)
    │   ├── services/        # Requisições HTTP (com Axios)
    │   ├── styles/          # CSS global e configurações do Tailwind
    │   ├── utils/           # Funções auxiliares
    │   ├── App.jsx          # Componente principal com rotas
    │   └── main.jsx         # Arquivo de entrada (renderização React)
    ├── .env                 # Variáveis de ambiente
    ├── index.html           # HTML base do Vite
    ├── tailwind.config.js   # Configurações Tailwind
    ├── postcss.config.js    # Configurações do PostCSS
    └── package.json         # Dependências e scripts
```

## 🧱 Pré-requisitos

Antes de iniciar o projeto, instale:

- **[Node.js](https://nodejs.org/)** (v18+ recomendado)
- **[Git](https://git-scm.com/)**

Verifique se Node e npm estão instalados:

```bash
node -v
npm -v
```

## 🚀 Instalação do Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/Web.git
cd Web/web-admin
```

### 2. Instale as dependências

```bash
npm install
```

Instalações que estão incluídas no `package.json`:

| Pacote               | Função                                      |
|----------------------|---------------------------------------------|
| `react`              | Biblioteca principal                        |
| `react-dom`          | Renderização de componentes                 |
| `vite`               | Dev server e build tool                     |
| `tailwindcss`        | Framework CSS utilitário                    |
| `postcss` / `autoprefixer` | Suporte ao Tailwind                     |
| `axios`              | Requisições HTTP                            |
| `react-router-dom`   | Roteamento SPA                              |
| `react-icons`        | Ícones SVG prontos para React              |
| `classnames` (opcional) | Manipulação condicional de classes CSS |

## 🛠️ Configuração do Tailwind CSS

O Tailwind já está pré-configurado no projeto. Confira se os seguintes arquivos existem:

### 📄 `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 📄 `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 📄 `src/styles/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Esse arquivo deve ser importado no `main.jsx`:

```js
import './styles/index.css';
```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz de `web-admin/` com as seguintes variáveis:

```env
VITE_API_URL=http://localhost:3000/api
```

> ⚠️ Nunca versionar esse arquivo (`.env` está no `.gitignore` por padrão)

## 💻 Comandos Principais

| Comando                        | Função                                  |
|-------------------------------|------------------------------------------|
| `npm run dev`                 | Inicia servidor de desenvolvimento       |
| `npm run build`               | Gera o build de produção (`/dist`)       |
| `npm run preview`             | Visualiza o build em ambiente local      |
| `npm install`                 | Instala as dependências listadas         |

## 🧩 Extensões recomendadas (VS Code)

- **ESLint** – Linting automático para JS/React
- **Prettier** – Formatação automática de código
- **Tailwind CSS IntelliSense** – Autocompletar classes do Tailwind
- **React Developer Tools** – Inspeção de componentes React (browser)
- **DotENV** – Suporte a arquivos `.env`

## ✅ Checklist de Boas Práticas

- [x] Componentes organizados por função
- [x] Lógica de API separada em `services/`
- [x] Hooks reutilizáveis em `hooks/`
- [x] Contextos globais com `contexts/`
- [x] Estilização usando classes Tailwind
- [x] Separação clara entre lógica e apresentação

## 📌 Observações

- Em caso de dúvidas ou erros, **verifique se o `.env` está criado corretamente** e se a API (backend) está rodando.
- Este projeto é **modular** e pode ser expandido facilmente adicionando novas pastas em `modules/`.

## 📞 Suporte

Qualquer dúvida: **falar com os scrums ou líder de grupo**.
