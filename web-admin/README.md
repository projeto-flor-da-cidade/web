

````
# 🌼 Flor da Cidade - Web Admin

Este projeto é a interface administrativa do sistema **Flor da Cidade**, desenvolvida com **React.js**, **Vite**, **Tailwind CSS** e **Axios**. Ele se conecta a uma API backend feita em **Java Spring Boot**.

---

## ⚙️ Tecnologias Utilizadas

- [React.js](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
---

## 🛠️ Instalação e Setup

### 1. Clone o repositório principal

```bash
git clone https://github.com/projeto-flor-da-cidade/web.gitn
````

### 2. Criação do projeto com Vite (caso ainda não exista)

```bash
npm create vite@latest . -- --template react
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Instale Tailwind CSS e configure

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
npx tailwindcss init -p
```

#### Configure o `tailwind.config.cjs`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Atualize `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Instale Axios

```bash
npm install axios
```

---

## 🔐 Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_API_URL=http://localhost:8080/api
```

> Substitua a URL conforme sua API real.

---

## 🧩 Estrutura de Pastas

```bash
src/
├── modules/            # Recursos organizados por funcionalidade (Feature-based)
│   └── Home/
│       ├── components/ # Componentes da página Home
│       ├── hooks/      # Hooks relacionados à Home
│       ├── services/   # API da Home
│       ├── styles/     # Estilos locais (ex: home.module.css)
│       └── Home.jsx    # Componente principal da rota
├── components/         # Componentes reutilizáveis globais
├── contexts/           # Contextos React globais
├── hooks/              # Hooks reutilizáveis globais
├── services/           # Serviços globais de API
├── styles/             # Estilos globais e reset
├── App.jsx
└── main.jsx
```

---

## 🚀 Scripts disponíveis

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Gera build de produção
npm run preview   # Serve build localmente
```

---

## 💡 Extensões recomendadas no VS Code

* **ESLint**: análise de código
* **Prettier**: formatação automática
* **Tailwind CSS IntelliSense**: autocompletar e highlight para Tailwind
* **React Developer Tools** (Chrome extension)

---

## 📦 Versão do Node recomendada

```bash
node -v
v18.x.x ou superior
```
