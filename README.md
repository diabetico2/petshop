# Petshop Fullstack

Aplicativo completo para gerenciamento de pets, com backend próprio (NestJS + PostgreSQL) e frontend mobile (React Native + Expo). O backend utiliza **apenas PostgreSQL** (hospedado no Railway), sem Supabase. O frontend se comunica exclusivamente com o backend via API REST.

## Arquitetura

- **Frontend:** React Native + Expo (pasta `petcare-app/`)
- **Backend:** NestJS (pasta `backend/`)
- **Banco de dados:** PostgreSQL (Railway)
- **Comunicação:** O app mobile consome apenas a API do backend. O backend faz toda a lógica de autenticação, cadastro e gerenciamento de pets/produtos.

## Funcionalidades

- Autenticação de usuários (JWT)
- Cadastro e gerenciamento de pets
- Cadastro e gerenciamento de produtos para pets
- Upload de imagens
- Interface moderna e responsiva

## Tecnologias Utilizadas

- **Frontend:**
  - React Native
  - Expo
  - TypeScript
  - React Native Paper
  - Expo Router
- **Backend:**
  - NestJS
  - TypeScript
  - PostgreSQL (Railway)
  - JWT
  - Multer (upload de imagens)

## Requisitos

- Node.js 16 ou superior
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android) ou Xcode (para iOS)

## Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/diabetico2/petshop.git
cd petshop
```

### 2. Backend
```bash
cd backend
npm install
```
- Crie um arquivo `.env` com as variáveis:
  ```env
  DATABASE_URL=postgresql://usuario:senha@host:porta/dbname # string do Railway
  JWT_SECRET=sua_chave_secreta
  PORT=3000
  ```
- Rode as migrações do banco (se necessário)
- Inicie o servidor:
  ```bash
  npm run start:dev
  ```

### 3. Frontend
```bash
cd ../petcare-app
npm install
```
- Crie um arquivo `.env` (se necessário) e defina a URL do backend:
  ```env
  API_URL=http://localhost:3000 # ou IP da sua máquina na rede
  ```
- Inicie o app:
  ```bash
  npm start
  # ou
  npx expo start
  ```
- Use o Expo Go ou emulador para rodar o app mobile.

## Estrutura do Projeto

```
petshop/
├── backend/         # Backend NestJS (API REST)
│   ├── src/
│   ├── prisma/
│   ├── uploads/
│   └── ...
├── petcare-app/     # Frontend mobile (Expo/React Native)
│   ├── app/
│   ├── lib/
│   ├── contexts/
│   ├── types/
│   ├── theme/
│   ├── assets/
│   └── ...
└── README.md      
```

## Endpoints principais do backend

- `POST /auth/login` — Login e obtenção do token JWT
- `POST /auth/register` — Cadastro de usuário
- `GET /auth/me` — Dados do usuário autenticado
- `GET /usuarios` — Listar usuários
- `GET /usuarios/:id/pets` — Listar pets de um usuário
- `GET /pets` — Listar pets
- `POST /pets` — Criar pet
- `PUT /pets/:id` — Atualizar pet
- `DELETE /pets/:id` — Remover pet
- `GET /pets/:id/produtos` — Listar produtos de um pet
- `GET /produtos` — Listar produtos
- `POST /produtos` — Criar produto
- `PUT /produtos/:id` — Atualizar produto
- `DELETE /produtos/:id` — Remover produto
- `POST /upload` — Upload de imagem

> Todas as rotas protegidas exigem Bearer Token JWT no header: `Authorization: Bearer <token>`

## Observações

- O frontend **NÃO** acessa banco de dados ou Supabase diretamente, apenas o backend.
- O backend valida todos os dados recebidos e segue boas práticas de segurança.
- Para produção, use HTTPS e variáveis de ambiente seguras.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
