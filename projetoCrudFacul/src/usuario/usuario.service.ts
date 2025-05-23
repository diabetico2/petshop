import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Usuario } from 'generated/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsuarioService {
    constructor(private readonly prisma: PrismaService) {}

    async listarUsuarios(): Promise<Usuario[]> {
        try {
            return await this.prisma.usuario.findMany({
                orderBy: { id: 'asc' }
            });
        } catch (error) {
            throw new InternalServerErrorException('Erro ao listar usuários. Por favor, tente novamente.');
        }
    }

    async encontrarUsuario(id: number): Promise<Usuario | null> {
        try {
            return await this.prisma.usuario.findUnique({
                where: { id }
            });
        } catch (error) {
            throw new InternalServerErrorException('Erro ao buscar usuário. Por favor, tente novamente.');
        }
    }

    async encontrarPetsUsuario(id: number) {
        try {
            return await this.prisma.usuario.findUnique({
                where: { id },
                include: { pets: true }
            });
        } catch (error) {
            throw new InternalServerErrorException('Erro ao buscar pets do usuário. Por favor, tente novamente.');
        }
    }

    async criarUsuario(dados: { nome: string; email: string; senha: string }): Promise<Usuario> {
        try {
            // Verifica se o email já existe
            const usuarioExistente = await this.prisma.usuario.findUnique({
                where: { email: dados.email }
            });

            if (usuarioExistente) {
                throw new ConflictException('Este email já está cadastrado. Por favor, use outro email.');
            }

            // Verifica se o nome já existe
            const nomeExistente = await this.prisma.usuario.findFirst({
                where: { nome: dados.nome }
            });

            if (nomeExistente) {
                throw new ConflictException('Este nome já está em uso. Por favor, escolha outro nome.');
            }

            // Cria o usuário
            return await this.prisma.usuario.create({
                data: dados
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Erro ao criar usuário. Por favor, tente novamente.');
        }
    }

    async atualizarUsuario(id: number, dados: { nome?: string; email?: string; senha?: string }): Promise<Usuario> {
        await this.verificarExistencia(id);
        try {
            // Se estiver atualizando o email, verifica se já existe
            if (dados.email) {
                const emailExistente = await this.prisma.usuario.findFirst({
                    where: {
                        email: dados.email,
                        id: { not: id }
                    }
                });

                if (emailExistente) {
                    throw new ConflictException('Este email já está cadastrado. Por favor, use outro email.');
                }
            }

            // Se estiver atualizando o nome, verifica se já existe
            if (dados.nome) {
                const nomeExistente = await this.prisma.usuario.findFirst({
                    where: {
                        nome: dados.nome,
                        id: { not: id }
                    }
                });

                if (nomeExistente) {
                    throw new ConflictException('Este nome já está em uso. Por favor, escolha outro nome.');
                }
            }

            return await this.prisma.usuario.update({
                where: { id },
                data: dados
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Erro ao atualizar usuário. Por favor, tente novamente.');
        }
    }

    async excluirUsuario(id: number) {
        await this.verificarExistencia(id);
        try {
            await this.prisma.usuario.delete({
                where: { id }
            });
            return { message: 'Usuário deletado com sucesso' };
        } catch (error) {
            throw new InternalServerErrorException('Erro ao deletar usuário. Por favor, tente novamente.');
        }
    }

    private async verificarExistencia(id: number) {
        const usuario = await this.encontrarUsuario(id);
        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }
    }
} 