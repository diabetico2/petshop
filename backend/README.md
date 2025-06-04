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
