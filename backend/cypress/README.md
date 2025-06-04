# Testes Automatizados da API

Este diretório contém os testes automatizados da API usando Cypress.

## O que é o Cypress?
O Cypress é uma ferramenta moderna para testes automatizados, muito usada tanto para front-end quanto para APIs. Ele permite simular requisições HTTP, validar respostas e até acompanhar visualmente cada passo do teste, o que facilita muito a identificação de problemas.

## Dicas para o professor
- **Os testes estão organizados para cobrir tanto casos de sucesso quanto de erro.**
- Quando um teste falha, o Cypress mostra exatamente o que foi enviado para a API, o que era esperado e o que foi recebido. Isso ajuda a entender rapidamente se o problema está no teste ou na API.
- Na interface gráfica do Cypress (`npx cypress open`), é possível ver o passo a passo de cada requisição, os dados enviados, as respostas e até prints do estado da aplicação/teste.
- Os testes de erro (por exemplo, tentar criar um usuário com dados inválidos) são essenciais para garantir que a API está validando corretamente as entradas. Se um teste desses falhar, normalmente é porque a API está aceitando dados que deveria recusar.
- Os testes são independentes: cada um cria e limpa seus próprios dados, então não é preciso se preocupar com "sujeira" no banco.

## Pré-requisitos

- Node.js instalado
- API rodando localmente na porta 3000
- Cypress instalado globalmente ou como dependência do projeto

## Instalação

1. Instale as dependências do projeto:
```bash
npm install
```

2. Instale o Cypress (caso ainda não esteja instalado):
```bash
npm install cypress --save-dev
```

## Executando os Testes

1. Certifique-se de que a API está rodando localmente na porta 3000

2. Para abrir o Cypress Test Runner (modo visual, recomendado para correção):
```bash
npx cypress open
```
   - Você poderá escolher o navegador e ver cada teste rodando passo a passo.

3. Para executar os testes via linha de comando:
```bash
npx cypress run
```
   - O resultado aparece no terminal, útil para automação/CI.

## Estrutura dos Testes

Os testes estão organizados em três arquivos principais:

- `usuarios.cy.js`: Testes da API de usuários
- `pets.cy.js`: Testes da API de pets
- `produtos.cy.js`: Testes da API de produtos

Cada arquivo contém testes para:
- Criação de recursos
- Listagem de recursos
- Busca por ID
- Atualização
- Exclusão
- Casos de erro

## Casos de Teste

### Usuários
- Criação de usuário com sucesso
- Criação com dados inválidos
- Listagem de usuários
- Busca por ID
- Atualização
- Exclusão

### Pets
- Criação de pet com sucesso
- Criação com dados inválidos
- Listagem de pets
- Busca por ID
- Atualização
- Exclusão

### Produtos
- Criação de produto com sucesso
- Criação com dados inválidos
- Listagem de produtos
- Busca por ID
- Atualização
- Exclusão

## Observações

- Os testes são independentes e incluem setup e cleanup automáticos
- Cada teste verifica tanto casos de sucesso quanto de erro
- Os testes incluem validação de status HTTP e conteúdo das respostas
- Dados de teste são criados e removidos automaticamente
- O Cypress facilita muito a visualização e depuração dos testes, tornando a correção mais simples e transparente 