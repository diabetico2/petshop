import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProdutoService {
    private readonly prisma = new PrismaClient();

    async listarProdutos(): Promise<any[]> {
        return this.prisma.produto.findMany();
    }

    async encontrarProduto(id: string): Promise<any | null> {
        return this.prisma.produto.findUnique({ where: { id } });
    }

    async encontrarProdutosPorPet(petId: string): Promise<any[]> {
        return this.prisma.produto.findMany({ where: { petid: petId } });
    }

    async criarProduto(dados: any): Promise<any> {
        const { petId, ...rest } = dados;
        return this.prisma.produto.create({
            data: {
                ...rest,
                petid: petId,
            },
        });
    }

    async atualizarProduto(id: string, dados: any): Promise<any> {
        const { petId, ...rest } = dados;
        return this.prisma.produto.update({
            where: { id },
            data: {
                ...rest,
                ...(petId && { petid: petId }),
            },
        });
    }

    async excluirProduto(id: string) {
        await this.prisma.produto.delete({ where: { id } });
        return { message: 'Produto deletado com sucesso' };
    }
}
