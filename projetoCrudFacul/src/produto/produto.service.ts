import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Produto } from 'generated/prisma';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutoService {
    constructor(private readonly prisma: PrismaService) {}

    async listarProdutos(): Promise<Produto[]> {
        return this.prisma.produto.findMany();
    }

    async encontrarProduto(id: number): Promise<Produto | null> {
        return this.prisma.produto.findUnique({
            where: { id }
        });
    }

    async encontrarPetProduto(id: number) {
        return this.prisma.produto.findUnique({
            where: { id },
            include: { petRel: true }
        });
    }

    async criarProduto(dados: CreateProdutoDto): Promise<Produto> {
        const { petId, ...produtoData } = dados;
        
        return this.prisma.produto.create({
            data: {
                ...produtoData,
                petRel: {
                    connect: petId ? { id: petId } : undefined
                }
            }
        });
    }

    async atualizarProduto(id: number, dados: UpdateProdutoDto): Promise<Produto> {
        await this.verificarExistencia(id);
        return this.prisma.produto.update({
            where: { id },
            data: dados
        });
    }

    async excluirProduto(id: number) {
        await this.verificarExistencia(id);
        await this.prisma.produto.delete({
            where: { id }
        });
        return { message: 'Produto deletado com sucesso' };
    }

    private async verificarExistencia(id: number) {
        const produto = await this.encontrarProduto(id);
        if (!produto) {
            throw new NotFoundException('Produto não encontrado');
        }
    }
}
