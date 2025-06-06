import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ProdutoController],
    providers: [ProdutoService],
    exports: [ProdutoService]
})
export class ProdutoModule {}
