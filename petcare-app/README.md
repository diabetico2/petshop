# PetCare App

Aplicativo mobile para gerenciar os cuidados do seu pet, desenvolvido com React Native, Expo e TypeScript. O app se comunica exclusivamente com o backend (NestJS), que faz toda a lógica de autenticação, cadastro e gerenciamento de pets e produtos.

## Funcionalidades

- Autenticação de usuários
- Cadastro e gerenciamento de pets
- Cadastro e gerenciamento de produtos para pets
- Interface moderna e intuitiva

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- React Native Paper
- Expo Router
- Backend: NestJS (API REST)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Backend rodando (ver instruções na pasta `/backend`)

## Instalação

1. Clone o repositório e acesse a pasta do app:
   ```bash
   git clone https://github.com/seu-usuario/petshop.git
   cd petshop/petcare-app
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure a URL do backend:
   - Crie um arquivo `.env` na raiz do projeto (opcional)
   - Defina a variável `API_URL` com o endereço do backend, por exemplo:
     ```env
     API_URL=https://petshop-production.up.railway.app
     ```
   - Se não definir, o app usará automaticamente o endpoint online de produção.
4. Inicie o aplicativo:
   ```bash
   npm start
   # ou
   npx expo start
   ```

## Estrutura do Projeto

```
petcare-app/
├── app/                    # Telas e rotas do app
│   ├── _layout.tsx        # Layout principal
│   ├── index.tsx          # Tela de login
│   ├── register.tsx       # Tela de registro
│   └── pets/              # Telas relacionadas a pets e produtos
├── lib/                   # Bibliotecas e utilitários (ex: api.ts)
├── contexts/              # Contextos globais (ex: AuthContext)
├── types/                 # Definições de tipos
├── theme/                 # Configuração de tema
├── assets/                # Imagens e ícones
├── App.tsx                # Entry point do app
├── app.json               # Configuração do Expo
└── package.json           # Dependências e scripts
```

## Scripts úteis

- `npm start` — inicia o Expo
- `npm run android` — inicia no emulador Android
- `npm run ios` — inicia no simulador iOS
- `npm run web` — inicia no navegador
- `npm run lint` — checa o lint do projeto

## Observações

- O app **NÃO** se conecta diretamente ao Supabase. Toda comunicação é feita via backend próprio (NestJS).
- Para rodar o app, o backend deve estar rodando e acessível na mesma rede.
- Para gerar APK, utilize o EAS Build (veja documentação Expo).

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 