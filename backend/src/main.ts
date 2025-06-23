// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilita CORS para múltiplas origens
  app.enableCors({
    origin: [
      'http://localhost:8081', // Para desenvolvimento local
      'https://petshop-production.up.railway.app', // URL do backend
      /^https:\/\/.*\.expo\.dev$/, // Para Expo Go
      /^https:\/\/.*\.vercel\.app$/, // Se usar Vercel
      '*' // Para desenvolvimento, remover em produção
    ],
    credentials: true,
  });

  // Configurar pasta de uploads para servir arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();