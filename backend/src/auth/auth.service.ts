import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly prisma = new PrismaClient();

  async register(email: string, password: string, nome: string) {
    // Verifica se já existe usuário com o mesmo email
    const existing = await this.prisma.usuario.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email já cadastrado');
    
    // Hash da senha antes de salvar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Cria usuário
    const usuario = await this.prisma.usuario.create({
      data: { email, senha: hashedPassword, nome },
    });
    return usuario;
  }

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    // Compara a senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, usuario.senha);
    if (!isPasswordValid) {
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