# Projeto CRUD Faculdade

API RESTful desenvolvida com NestJS e Prisma para gerenciamento de usuários, pets e produtos.

## Tecnologias Utilizadas

- NestJS
- Prisma ORM
- MySQL
- TypeScript
- Class Validator
- Postman (para testes)

## Instruções de Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/diabetico2/projetoCrudFacul.git
   cd projetoCrudFacul
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   - Copie o arquivo de exemplo `.env.example` para `.env`:
     
     ```bash
     cp .env.example .env
     ```
     
   - Edite o arquivo `.env` e configure a variável `DATABASE_URL` para apontar para o seu MySQL. Exemplo:
     
     ```dotenv
     DATABASE_URL="mysql://root:99219830@localhost:3306/api_"
     PORT=3000
     ```

4. **Prepare o banco de dados:**

   - Certifique-se de que o MySQL está rodando e que o banco de dados (no exemplo, `api_`) foi criado.  
     Se necessário, crie o banco de dados usando o MySQL Workbench ou pela linha de comando.
   - Aplique as migrações para criar a estrutura no banco:
     
     ```bash
     npx prisma migrate deploy
     ```

5. **Inicie a aplicação:**

   ```bash
   npm run start:dev
   ```

1.2 **Testes Automatizados da API**

## Instalação

```bash
npm install
npm install cypress --save-dev
```

## Como rodar os testes

1. Inicie a API localmente na porta 3000.
2. Para rodar os testes com interface gráfica:
   ```bash
   npx cypress open
   ```
3. Para rodar os testes no terminal:
   ```bash
   npx cypress run
   ```

# Documentação completa do projeto Petshop

## Arquitetura
- O frontend (Expo/React Native) se comunica apenas com o backend (NestJS).
- O backend usa Supabase apenas como banco de dados relacional (PostgreSQL).
- O Supabase NÃO é acessado diretamente pelo frontend.

## Autenticação
- Todas as rotas protegidas exigem Bearer Token JWT.
- O token é obtido via POST /auth/login.
- Exemplo de header:
  Authorization: Bearer <token>

## Endpoints principais
- /usuarios: CRUD de usuários
- /pets: CRUD de pets (vinculados a usuários)
- /produtos: CRUD de produtos (vinculados a pets)

## Exemplos de uso
- Veja o arquivo `api krauser.postman_collection.json` para exemplos detalhados de requests/responses, headers e erros.

## Como rodar o backend
- Instale as dependências: `npm install`
- Configure as variáveis de ambiente (`.env`):
  - DATABASE_URL (string de conexão do Supabase/Postgres)
  - JWT_SECRET (segredo para assinar tokens)
  - Outras variáveis conforme necessário
- Rode as migrações do banco se necessário
- Inicie o servidor: `npm run start:dev`

## Como rodar o frontend
- Instale as dependências: `npm install` na pasta petcare-app
- Inicie o app: `npx expo start` ou `npm run start`
- Para gerar APK: siga instruções do EAS Build (veja documentação Expo)

## Troubleshooting
- Erros de autenticação: verifique se o token está correto e não expirou
- Erros de conexão: confira a string do banco e se o Supabase está online
- Logs detalhados estão disponíveis no terminal do backend

## Estrutura de pastas

```text
backend/
  src/
    auth/         # Autenticação (controllers, services, DTOs)
      dto/
    usuario/      # Usuários (controllers, services)
    pet/          # Pets (controllers, services, entidades, DTOs)
      entities/
      dto/
    produto/      # Produtos (controllers, services, entidades, DTOs)
      entities/
      dto/
    upload/       # Upload de imagens
    middleware/   # Middlewares (ex: autenticação)
    user/         # (pasta auxiliar, DTOs/entidades)
      entities/
      dto/
    prisma/       # (pasta auxiliar, se necessário)
    app.module.ts # Módulo principal do NestJS
    main.ts       # Bootstrap da aplicação
    app.controller.ts / app.service.ts # Controlador e serviço principal
  prisma/
    migrations/   # Migrações do banco
      20250618161643_init/
        migration.sql # Script de migração inicial
      migration_lock.toml
    schema.prisma # Schema do banco de dados
  uploads/        # Imagens enviadas pelo usuário
  package.json    # Dependências do projeto
  tsconfig.json   # Configuração TypeScript
  ...
```

- Cada módulo (auth, usuario, pet, produto, upload) possui controllers, services e, quando necessário, DTOs e entidades.
- A pasta `prisma/` contém o schema do banco e as migrações.
- A pasta `uploads/` armazena imagens enviadas via API.
- Arquivos de configuração e dependências ficam na raiz do backend.

## Boas práticas e observações
- Nunca exponha o token JWT ou a string do banco
- Sempre use HTTPS em produção
- O backend valida todos os dados recebidos
- O código segue padrão modular do NestJS

## Referências
- Arquivo Postman: `backend/api krauser.postman_collection.json`
- Documentação oficial do NestJS, Expo, Supabase

## Como funciona o backend e funções dos módulos

### auth
- Responsável pelo registro (`/auth/register`), login (`/auth/login`) e consulta do usuário logado (`/auth/me`).
- Utiliza JWT para autenticação e validação de sessões.
- Exemplo de fluxo: usuário faz login, recebe token JWT, usa esse token para acessar rotas protegidas.

### usuario
- CRUD completo de usuários (`/usuarios`).
- Permite listar todos, buscar por ID, atualizar e deletar usuários.
- Permite listar todos os pets de um usuário (`/usuarios/:id/pets`).
- Valida duplicidade de email e existência de usuário.

### pet
- CRUD completo de pets (`/pets`).
- Permite listar todos, buscar por ID, atualizar e deletar pets.
- Permite listar todos os produtos de um pet (`/pets/:id/produtos`).
- Cada pet pertence a um usuário.

### produto
- CRUD completo de produtos (`/produtos`).
- Permite listar todos, buscar por ID, atualizar e deletar produtos.
- Permite listar produtos de um pet específico.
- Cada produto pertence a um pet.
- Validações de campos e tratamento de erros (ex: produto não encontrado).

### upload
- Upload de imagens via `/upload`.
- Aceita apenas arquivos de imagem (jpg, jpeg, png, gif) até 5MB.
- Salva arquivos na pasta `uploads/` e retorna a URL da imagem.
- Exemplo de resposta: `{ url, filename, originalName, size }`

### middleware (auth.middleware.ts)
- Responsável por interceptar requisições e validar autenticação JWT.
- Pode ser customizado para validar tokens, permissões, etc.

### app.module.ts e main.ts
- Fazem o bootstrap da aplicação e organizam a importação dos módulos.
- `main.ts` inicia o servidor e aplica middlewares globais.

### Fluxo geral
1. Usuário registra ou faz login e recebe um JWT.
2. Usa o JWT no header Authorization para acessar rotas protegidas.
3. Cada módulo (usuario, pet, produto) expõe endpoints REST para CRUD e consultas relacionadas.
4. O backend valida dados, executa operações no banco (Supabase/Postgres) e retorna respostas padronizadas.
5. Uploads de imagem são tratados separadamente e retornam URLs para uso no frontend.

## Estrutura de pastas do frontend

```text
petcare-app/
  app/           # Telas e navegação principal (React Navigation)
    pets/        # Telas de listagem, detalhes, criação e edição de pets
      [id]/      # Telas de detalhes e edição de um pet específico
        produtos/        # Telas de produtos de um pet
          [produtoId]/   # Tela de edição de produto específico
    appointments/ # Telas de agendamento (exemplo)
    register.tsx  # Tela de registro
    index.tsx     # Tela inicial
    _layout.tsx   # Layout de navegação
  contexts/       # Contextos globais (ex: autenticação)
  lib/            # Serviços de API e utilitários
  types/          # Tipos TypeScript globais
  theme/          # Temas e estilos globais
  assets/         # Imagens e ícones
  App.tsx         # Entry point do app Expo
  app.json        # Configuração do app Expo
  eas.json        # Configuração do EAS Build
  package.json    # Dependências do projeto
  tsconfig.json   # Configuração TypeScript
  ...
```

- A pasta `app/` contém todas as telas e navegação do app.
- `contexts/` centraliza estados globais como autenticação.
- `lib/` traz funções utilitárias e integração com a API do backend.
- `types/` define os tipos TypeScript usados em todo o app.
- `theme/` centraliza estilos e temas visuais.
- `assets/` armazena imagens e ícones usados na interface.
- Arquivos como `App.tsx`, `app.json` e `eas.json` são essenciais para configuração e inicialização do app Expo.
