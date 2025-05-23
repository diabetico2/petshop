# PetCare App

Aplicativo mobile para gerenciamento de pets, desenvolvido com React Native e Expo.

## Funcionalidades

- Cadastro e gerenciamento de pets
- Agendamento de consultas veterinárias
- Histórico de saúde do pet
- Perfil do usuário com múltiplos pets

## Tecnologias Utilizadas

- TypeScript
- React Native
- Expo
- Expo Router
- Prisma
- React Native Paper
- AsyncStorage

## Requisitos

- Node.js 16 ou superior
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android) ou Xcode (para iOS)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
cd petcare-app
npm install
```

3. Inicie o projeto:
```bash
npx expo start
```

## Estrutura do Projeto

```
src/
  ├── app/           # Rotas e navegação (Expo Router)
  ├── components/    # Componentes reutilizáveis
  ├── screens/       # Telas do aplicativo
  ├── services/      # Serviços e APIs
  ├── types/         # Definições de tipos TypeScript
  └── utils/         # Funções utilitárias
```

## Como Executar

1. Instale o aplicativo Expo Go no seu dispositivo móvel
2. Escaneie o QR Code que aparece no terminal após executar `npx expo start`
3. O aplicativo será carregado no seu dispositivo

## Desenvolvimento

Para desenvolvimento, você pode usar:
- Emulador Android/iOS
- Dispositivo físico com Expo Go
- Web browser (algumas funcionalidades podem ter limitações) 