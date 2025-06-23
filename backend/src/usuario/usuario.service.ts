import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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

    async atualizarUsuario(id: string, dados: { 
        nome?: string; 
        email?: string; 
        senha?: string;
        senhaAtual?: string;
        novaSenha?: string;
    }): Promise<any> {
        // Verificar se o usuário existe
        const usuarioExistente = await this.prisma.usuario.findUnique({ where: { id } });
        if (!usuarioExistente) {
            throw new NotFoundException('Usuário não encontrado');
        }

        // Verificar email único
        if (dados.email) {
            const emailExistente = await this.prisma.usuario.findUnique({ where: { email: dados.email } });
            if (emailExistente && emailExistente.id !== id) {
                throw new ConflictException('Este email já está cadastrado.');
            }
        }

        // Dados para atualização
        const dadosParaAtualizar: any = {};
        
        if (dados.nome) dadosParaAtualizar.nome = dados.nome;
        if (dados.email) dadosParaAtualizar.email = dados.email;

        // Verificar se está tentando alterar a senha
        if (dados.novaSenha) {
            if (!dados.senhaAtual) {
                throw new BadRequestException('Senha atual é obrigatória para alterar a senha');
            }

            // Verificar se a senha atual está correta
            const senhaAtualCorreta = await bcrypt.compare(dados.senhaAtual, usuarioExistente.senha);
            if (!senhaAtualCorreta) {
                throw new BadRequestException('Senha atual incorreta');
            }

            // Hash da nova senha
            const saltRounds = 10;
            dadosParaAtualizar.senha = await bcrypt.hash(dados.novaSenha, saltRounds);
        }

        const usuario = await this.prisma.usuario.update({ 
            where: { id }, 
            data: dadosParaAtualizar 
        });
        
        // Remover a senha do retorno
        const { senha, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
    }

    async excluirUsuario(id: string) {
        await this.prisma.usuario.delete({ where: { id } });
            return { message: 'Usuário deletado com sucesso' };
    }
} 