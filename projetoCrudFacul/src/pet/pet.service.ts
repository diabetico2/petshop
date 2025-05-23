import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pet } from 'generated/prisma';

@Injectable()
export class PetService {
    constructor(private readonly prisma: PrismaService) {}

    async listarPets(): Promise<Pet[]> {
        return this.prisma.pet.findMany();
    }

    async encontrarPet(id: number): Promise<Pet> {
        const pet = await this.prisma.pet.findUnique({
            where: { id }
        });
        if (!pet) {
            throw new NotFoundException('Pet não encontrado');
        }
        return pet;
    }

    async encontrarProdutosPet(id: number) {
        return this.prisma.pet.findUnique({
            where: { id },
            include: { produtos: true }
        });
    }

    async criarPet(dados: { nome: string; raca: string; usuarioId: number }): Promise<Pet> {
        return this.prisma.pet.create({
            data: dados
        });
    }

    async atualizarPet(id: number, dados: { nome?: string; raca?: string }): Promise<Pet> {
        await this.verificarExistencia(id);
        return this.prisma.pet.update({
            where: { id },
            data: dados
        });
    }

    async excluirPet(id: number) {
        await this.verificarExistencia(id);
        await this.prisma.pet.delete({
            where: { id }
        });
        return { message: 'Pet deletado com sucesso' };
    }

    private async verificarExistencia(id: number) {
        const pet = await this.encontrarPet(id);
        if (!pet) {
            throw new NotFoundException('Pet não encontrado');
        }
    }
}
