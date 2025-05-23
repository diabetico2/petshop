import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetModule } from './pet/pet.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ProdutoModule } from './produto/produto.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PetModule, UsuarioModule, ProdutoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
