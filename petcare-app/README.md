# PetCare App

Um aplicativo para gerenciar os cuidados do seu pet, desenvolvido com React Native e Expo.

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
- Supabase (Autenticação e Banco de Dados)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Supabase

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/petcare-app.git
cd petcare-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis com suas credenciais do Supabase:
  - `SUPABASE_URL`: URL do seu projeto no Supabase
  - `SUPABASE_ANON_KEY`: Chave anônima do seu projeto no Supabase

4. Inicie o aplicativo:
```bash
npm start
```

## Estrutura do Projeto

```
petcare-app/
├── app/                    # Diretório principal da aplicação
│   ├── _layout.tsx        # Layout principal
│   ├── index.tsx          # Tela de login
│   ├── register.tsx       # Tela de registro
│   └── pets/              # Telas relacionadas a pets
├── lib/                   # Bibliotecas e configurações
│   └── supabase.ts        # Configuração do Supabase
├── types/                 # Definições de tipos
│   ├── index.ts           # Tipos da aplicação
│   └── env.d.ts           # Tipos para variáveis de ambiente
└── theme/                 # Configurações de tema
    └── index.ts           # Definição do tema
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 