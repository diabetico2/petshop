# Backend Petshop (NestJS)

API RESTful desenvolvida em NestJS para gerenciamento de usuários, pets e produtos. O backend faz toda a lógica de autenticação, cadastro e gerenciamento, e utiliza o Supabase **apenas como banco de dados relacional (PostgreSQL)**. O frontend se comunica exclusivamente com esta API.

## Tecnologias Utilizadas

- NestJS
- TypeScript
- Supabase (PostgreSQL)
- JWT (autenticação)
- Multer (upload de imagens)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Supabase (para provisionar o banco)

## Instalação

1. Clone o repositório e acesse a pasta do backend:
   ```bash
   git clone https://github.com/seu-usuario/petshop.git
   cd petshop/backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do backend.
   - Exemplo de variáveis:
     ```env
     DATABASE_URL=postgresql://usuario:senha@host:porta/dbname
     JWT_SECRET=sua_chave_secreta
     PORT=3000
     ```
   - Use a string de conexão do Supabase (Postgres) para o `DATABASE_URL`.
4. Rode as migrações do banco (se necessário).
5. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

## Endpoints principais

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

## Estrutura de pastas

```
backend/
├── src/
│   ├── auth/         # Autenticação (controllers, services, DTOs)
│   ├── usuario/      # Usuários (controllers, services)
│   ├── pet/          # Pets (controllers, services, entidades, DTOs)
│   ├── produto/      # Produtos (controllers, services, entidades, DTOs)
│   ├── upload/       # Upload de imagens
│   ├── middleware/   # Middlewares (ex: autenticação)
│   ├── user/         # (DTOs/entidades auxiliares)
│   ├── prisma/       # (pasta auxiliar, se necessário)
│   ├── app.module.ts # Módulo principal
│   ├── main.ts       # Bootstrap da aplicação
│   ├── app.controller.ts / app.service.ts # Controlador e serviço principal
├── prisma/
│   ├── migrations/   # Migrações do banco
│   └── schema.prisma # Schema do banco de dados
├── uploads/          # Imagens enviadas pelo usuário
├── package.json      # Dependências do projeto
├── tsconfig.json     # Configuração TypeScript
└── ...
```

## Variáveis de ambiente

- `DATABASE_URL` — string de conexão do Supabase/Postgres
- `JWT_SECRET` — segredo para assinar tokens JWT
- `PORT` — porta do servidor (padrão: 3000)

## Observações

- O backend valida todos os dados recebidos.
- Nunca exponha o token JWT ou a string do banco.
- Sempre use HTTPS em produção.
- O backend segue padrão modular do NestJS.

## Testes

- Use o arquivo Postman `api krauser.postman_collection.json` para testar os endpoints.
- Testes automatizados podem ser adicionados conforme necessidade.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.
