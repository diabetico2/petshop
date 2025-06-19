import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsuarioService {
    private readonly prisma = new PrismaClient();

    async listarUsuarios(): Promise<any[]> {
        return this.prisma.usuario.findMany();
    }

    async encontrarUsuario(id: string): Promise<any | null> {
        return this.prisma.usuario.findUnique({ where: { id } });
    }

    async encontrarPetsUsuario(id: string) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { id },
            include: { pets: true },
        });
        if (!usuario) throw new NotFoundException('Usuário não encontrado');
        return usuario.pets;
    }

    async criarUsuario(dados: { nome: string; email: string; senha: string }): Promise<any> {
        const usuarioExistente = await this.prisma.usuario.findUnique({ where: { email: dados.email } });
        if (usuarioExistente) throw new ConflictException('Este email já está cadastrado.');
        const usuario = await this.prisma.usuario.create({ data: dados });
        return usuario;
    }

    async atualizarUsuario(id: string, dados: { nome?: string; email?: string; senha?: string }): Promise<any> {
        if (dados.email) {
            const emailExistente = await this.prisma.usuario.findUnique({ where: { email: dados.email } });
            if (emailExistente && emailExistente.id !== id) throw new ConflictException('Este email já está cadastrado.');
        }
        const usuario = await this.prisma.usuario.update({ where: { id }, data: dados });
        return usuario;
    }

    async excluirUsuario(id: string) {
        await this.prisma.usuario.delete({ where: { id } });
        return { message: 'Usuário deletado com sucesso' };
    }
} 