# Petshop Fullstack - Sistema de Gerenciamento de Pets

Sistema completo para gerenciamento de pets e produtos, desenvolvido com **React Native/Expo** no frontend e **NestJS** no backend. O sistema permite cadastro de usuários, autenticação segura, gerenciamento de pets e produtos, com upload de imagens e interface moderna.

## Arquitetura do Sistema

- **Frontend Mobile:** React Native + Expo (pasta `petcare-app/`)
- **Backend API:** NestJS + TypeScript (pasta `backend/`)
- **Banco de dados:** PostgreSQL (hospedado no Railway)
- **Autenticação:** Sistema próprio com bcrypt para senhas
- **Upload de arquivos:** Multer para imagens de pets
- **Comunicação:** API REST exclusiva entre frontend e backend

## Estrutura de Pastas

### Backend (`/backend`)
```
backend/
├── src/
│   ├── auth/                 # Módulo de autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── usuario/              # Módulo de usuários
│   │   ├── usuario.controller.ts
│   │   ├── usuario.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── pet/                  # Módulo de pets
│   │   ├── pet.controller.ts
│   │   ├── pet.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── produto/              # Módulo de produtos
│   │   ├── produto.controller.ts
│   │   ├── produto.service.ts
│   │   ├── dto/
│   │   └── entities/
│   ├── upload/               # Módulo de upload
│   │   ├── upload.controller.ts
│   │   └── upload.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma         # Schema do banco de dados
│   └── migrations/
├── uploads/                  # Arquivos de imagem uploadados
└── package.json
```

### Frontend (`/petcare-app`)
```
petcare-app/
├── app/                      # Telas do aplicativo (Expo Router)
│   ├── index.tsx            # Tela de login
│   ├── register.tsx         # Tela de cadastro
│   ├── _layout.tsx          # Layout principal e roteamento
│   ├── pets/
│   │   ├── index.tsx        # Lista de pets
│   │   ├── new.tsx          # Novo pet
│   │   └── [id]/            # Detalhes e edição de pet
│   └── account/
│       └── edit.tsx         # Edição de conta
├── contexts/
│   └── AuthContext.tsx      # Contexto de autenticação
├── lib/
│   └── api.ts              # Configurações da API
├── theme/
│   └── index.ts            # Tema personalizado
├── types/
│   └── index.ts            # Tipos TypeScript
├── assets/                  # Imagens e ícones
└── package.json
```

## Tecnologias Utilizadas

### Frontend (React Native)
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento e deploy
- **TypeScript** - Linguagem tipada
- **Expo Router** - Roteamento baseado em arquivos
- **React Native Paper** - Biblioteca de componentes Material Design
- **React Context** - Gerenciamento de estado de autenticação
- **AsyncStorage** - Persistência local de dados
- **Linear Gradient** - Gradientes visuais

### Backend (NestJS)
- **NestJS** - Framework Node.js modular
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos
- **CORS** - Cross-Origin Resource Sharing

### Infraestrutura
- **Railway** - Hospedagem do backend e banco PostgreSQL
- **Git/GitHub** - Controle de versão
- **Expo Go** - Teste em dispositivos móveis

## Funcionalidades Implementadas

### Autenticação e Usuários
- ✅ Cadastro de novos usuários
- ✅ Login com email e senha
- ✅ Hash seguro de senhas com bcrypt
- ✅ Edição de perfil (nome, email, senha)
- ✅ Exclusão de conta
- ✅ Logout seguro

### Gerenciamento de Pets
- ✅ Listagem de pets por usuário
- ✅ Cadastro de novos pets
- ✅ Edição de dados do pet
- ✅ Upload de foto do pet
- ✅ Exclusão de pets
- ✅ Visualização de detalhes

### Gerenciamento de Produtos
- ✅ Listagem de produtos por pet
- ✅ Cadastro de produtos/serviços
- ✅ Edição de produtos
- ✅ Exclusão de produtos
- ✅ Controle de preços e quantidades

## Endpoints da API

### Versão Local
**Base URL:** `http://localhost:3000`

### Versão Online (Produção)
**Base URL:** `https://petshop-production.up.railway.app`

### Autenticação
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login de usuário
- `GET /auth/me` - Dados do usuário autenticado

### Usuários
- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/:id` - Buscar usuário por ID
- `GET /usuarios/:id/pets` - Listar pets de um usuário
- `POST /usuarios` - Criar usuário
- `PATCH /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Excluir usuário

### Pets
- `GET /pets` - Listar pets (com filtro opcional `?userId=`)
- `GET /pets/:id` - Buscar pet por ID
- `GET /pets/:id/produtos` - Listar produtos de um pet
- `POST /pets` - Criar pet
- `PATCH /pets/:id` - Atualizar pet
- `DELETE /pets/:id` - Excluir pet

### Produtos
- `GET /produtos` - Listar produtos
- `GET /produtos/:id` - Buscar produto por ID
- `POST /produtos` - Criar produto
- `PUT /produtos/:id` - Atualizar produto
- `DELETE /produtos/:id` - Excluir produto

### Upload
- `POST /upload` - Upload de imagem

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

Crie um arquivo `.env` com as variáveis:
```env
DATABASE_URL=postgresql://usuario:senha@host:porta/dbname
BASE_URL=https://petshop-production.up.railway.app
JWT_SECRET=sua_chave_secreta
PORT=3000
```

Inicie o servidor:
```bash
npm run start:dev
```

### 3. Frontend
```bash
cd ../petcare-app
npm install
```

Configure a URL da API em `petcare-app/.env`:
```env
# Produção (padrão)
EXPO_PUBLIC_API_URL=https://petshop-production.up.railway.app

# Desenvolvimento local
# EXPO_PUBLIC_API_URL=http://localhost:3000
```

Inicie o app:
```bash
npx expo start
```

Use o Expo Go ou emulador para rodar o app mobile.

## Testes Manuais Documentados

### Teste 1: Fluxo Completo de Autenticação
**Objetivo:** Verificar cadastro, login e alteração de senha

**Passos realizados:**
1. Abrir o aplicativo e acessar "Criar conta"
2. Preencher dados: nome, email válido e senha
3. Confirmar cadastro e verificar redirecionamento
4. Fazer login com as credenciais criadas
5. Acessar "Editar Conta" e alterar a senha
6. Fazer logout e login com a nova senha
7. Verificar acesso bem-sucedido

**Resultado:** ✅ PASSOU - Autenticação funcionando corretamente com bcrypt

### Teste 2: Gerenciamento de Pets por Usuário
**Objetivo:** Verificar filtro de pets por usuário e CRUD completo

**Passos realizados:**
1. Fazer login com usuário A
2. Cadastrar 2 pets diferentes
3. Verificar que apenas os pets do usuário A aparecem na lista
4. Fazer logout e login com usuário B
5. Verificar lista vazia de pets para usuário B
6. Cadastrar 1 pet para usuário B
7. Editar dados do pet (nome, raça)
8. Excluir o pet
9. Verificar lista vazia novamente

**Resultado:** ✅ PASSOU - Filtro por usuário e CRUD funcionando

### Teste 3: Upload de Imagem e Gerenciamento de Produtos
**Objetivo:** Verificar upload de foto de pet e produtos associados

**Passos realizados:**
1. Cadastrar um novo pet
2. Acessar edição do pet e fazer upload de uma foto
3. Verificar se a imagem aparece na lista e detalhes do pet
4. Acessar produtos do pet
5. Cadastrar produto: "Ração Premium", tipo "Alimento", preço R$ 89,90
6. Editar o produto alterando preço para R$ 99,90
7. Cadastrar segundo produto: "Vacina V10"
8. Excluir o primeiro produto
9. Verificar que apenas a vacina permanece na lista

**Resultado:** ✅ PASSOU - Upload e produtos funcionando corretamente

## Melhorias Implementadas

- **Segurança:** Hash de senhas com bcrypt + salt
- **UX:** Navegação intuitiva com Expo Router
- **Performance:** Filtros otimizados no backend
- **Responsividade:** Interface adaptável a diferentes telas
- **Validação:** Validação de dados tanto no frontend quanto backend
- **Estado:** Gerenciamento consistente de autenticação

## Deploy

- **Backend:** Automaticamente deployado no Railway via GitHub
- **Frontend:** Disponível via Expo Go ou build nativo
- **Banco:** PostgreSQL gerenciado no Railway

