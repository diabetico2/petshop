import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  async register(email: string, password: string, nome: string) {
    // Verifica se já existe usuário com o mesmo email
    const existing = await this.prisma.usuario.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email já cadastrado');
    // Cria usuário
    const usuario = await this.prisma.usuario.create({
      data: { email, senha: password, nome },
    });
    return usuario;
  }

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario || usuario.senha !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    // Retorne o usuário (ou gere um JWT, se quiser)
    return usuario;
  }

  async getUser(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario) throw new UnauthorizedException('Usuário não encontrado');
    return usuario;
  }
} 