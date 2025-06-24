import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
// import eslintPluginReact from 'eslint-plugin-react'; // Você pode precisar deste para 'react/prop-types' etc. se usar

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020, // Pode manter ou atualizar para 'latest' se preferir, como em parserOptions
      globals: {
        ...globals.browser,
        // Adicione outros globais se necessário, ex: globals.node
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    // settings: { // Adicione 'settings' para react/version se usar eslint-plugin-react
    //   react: {
    //     version: 'detect',
    //   },
    // },
    plugins: {
      // react: eslintPluginReact, // Adicione se for usar regras específicas do React como prop-types
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // ...eslintPluginReact.configs.recommended.rules, // Adicione se usar eslint-plugin-react

      'no-unused-vars': ['warn', { // Alterado para 'warn' durante o desenvolvimento, pode ser 'error' para produção
        vars: 'all', // Verifica todas as variáveis
        args: 'after-used', // Verifica argumentos exceto o último se não usado
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',     // MODIFICADO: Ignora variáveis que começam com _
        argsIgnorePattern: '^_',     // ADICIONADO: Ignora argumentos de função que começam com _
        caughtErrors: 'all',         // Verifica todos os erros capturados em blocos catch
        caughtErrorsIgnorePattern: '^_' // ADICIONADO: Ignora erros capturados que começam com _
      }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Exemplo de regra do React (se você adicionar o plugin)
      // 'react/prop-types': 'off', // Desabilita se você usa TypeScript para tipos
      // Adicione outras regras ou ajustes conforme necessário
    },
  },
]