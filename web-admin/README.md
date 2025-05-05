# Flor da Cidade Web - README

Este documento descreve como configurar e iniciar o projeto **Flor da Cidade Web (web-normal)**, bem como apresentar uma breve explicação da funcionalidade de cada pasta principal.

---

## 👇 Pré-requisitos

* **Node.js** v16 ou superior
* **npm** (vem junto com o Node.js)
* **Git** (para versionamento de código)
* **VS Code** (recomendado)

---

## 🚀 Instalação e Setup

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/flor-da-cidade-web.git
   cd flor-da-cidade-web/web-normal
   ```

2. Instale dependências:

   ```bash
   npm install
   ```

3. Instale bibliotecas adicionais:

   ```bash
   npm install axios
   npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
   ```

4. Gere os arquivos de configuração do Tailwind e PostCSS (se ainda não existirem):

   ```bash
   npx tailwindcss init -p
   ```

5. Crie o arquivo de variáveis de ambiente na raiz do projeto:

   ```bash
   touch .env
   ```

   Abra o `.env` e defina a URL base da API Spring Boot:

   ```bash
   VITE_API_URL=http://localhost:8080/api
   ```

   > **Importante:** o Vite só expõe variáveis que comecem com `VITE_` ao código de front-end.

6. Adicione `.env` ao `.gitignore` (já deve estar incluído):

   ```gitignore
   # .gitignore
   .env
   ```

7. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

8. Abra o VS Code na pasta do projeto:

   ```bash
   code .
   ```

---

## 🛠 Extensões recomendadas para VS Code

* **ESLint** & **Prettier**: linting e formatação automática
* **Tailwind CSS IntelliSense**: autocomplete de classes Tailwind
* **Bracket Pair Colorizer**: facilita visualização de pares de colchetes
* **GitLens**: histórico e anotações avançadas do Git
* **Error Lens**: destaca erros e warnings inline
* **Path Intellisense**: autocomplete de caminhos de import

---

## 📁 Estrutura de Pastas e Função de Cada Diretório

```text
src/
├── assets/       # Imagens, fontes e ícones brutos
├── components/   # Componentes atômicos e genéricos (Button, Input, Modal)
├── contexts/     # React Contexts e Providers (ex: AuthContext)
├── hooks/        # Custom hooks reutilizáveis (useFetch, useToggle)
├── services/     # Clientes de API globais (api.js com Axios)
├── utils/        # Funções utilitárias puras (formatDate, validateEmail)
├── styles/       # Estilos globais e configurações Tailwind (tailwind.css)
├── modules/      # Features/páginas isoladas (cada pasta é uma rota)
│   └── Home/     # Exemplo de módulo “Home”:
│       ├── components/  # UI específica da Home (Header, HeroSection)
│       ├── hooks/       # Hooks da Home (useHomeData)
│       ├── services/    # API calls da Home (homeApi.js)
│       ├── styles/      # CSS Module ou estilos locais (home.module.css)
│       └── Home.jsx     # Componente de página que orquestra tudo
├── App.jsx       # Montagem de rotas e Providers
└── main.jsx      # Entry-point (renderiza App e importa CSS global)
```

---

## 🎯 Próximos Passos

* Configurar rotas com **React Router**
* Adicionar **context API** ou gerenciador de estado (Zustand/Redux) conforme necessidade
* Escrever **testes** com Jest e React Testing Library
* Configurar **CI/CD** (GitHub Actions, Vercel ou Netlify)

---

> Boa codificação e bem-vindo(a) ao projeto **Flor da Cidade Web**! 🌸
