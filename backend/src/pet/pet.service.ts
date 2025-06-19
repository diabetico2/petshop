import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PetService {
    private readonly prisma = new PrismaClient();

    async listarPets(): Promise<any[]> {
        return this.prisma.pet.findMany();
    }

    async encontrarPet(id: string): Promise<any | null> {
        const pet = await this.prisma.pet.findUnique({ where: { id } });
        if (!pet) throw new NotFoundException('Pet não encontrado');
        return pet;
    }

    async encontrarProdutosPet(id: string) {
        const pet = await this.prisma.pet.findUnique({
            where: { id },
            include: { produtos: true },
        });
        if (!pet) throw new NotFoundException('Pet não encontrado');
        return pet.produtos;
    }

    async criarPet(dados: any): Promise<any> {
        return this.prisma.pet.create({ data: dados });
    }

    async atualizarPet(id: string, dados: any): Promise<any> {
        return this.prisma.pet.update({ where: { id }, data: dados });
    }

    async excluirPet(id: string) {
        await this.prisma.pet.delete({ where: { id } });
        return { message: 'Pet deletado com sucesso' };
    }
}
