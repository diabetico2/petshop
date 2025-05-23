import { Body, Controller, Delete, Get, Patch, Post, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { Usuario } from 'generated/prisma';
import { UsuarioService } from './usuario.service';

@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly usuarioService: UsuarioService
    ) {}

    @Get()
    async listarUsuarios(): Promise<Usuario[]> {
        return this.usuarioService.listarUsuarios();
    }
    
    @Get(':id')
    async getUsuario(@Param('id') id: string): Promise<Usuario> {
        const usuario = await this.usuarioService.encontrarUsuario(+id);
        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return usuario;
    }
    
    @Get(':id/pets')
    async getPetsUsuario(@Param('id') id: string) {
        const usuario = await this.usuarioService.encontrarPetsUsuario(+id);
        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }
        return usuario.pets;
    }

    @Post()
    async criarUsuario(@Body() dados: { nome: string; email: string; senha: string }): Promise<Usuario> {
        return this.usuarioService.criarUsuario(dados);
    }

    @Patch(':id')
    async atualizarUsuario(
        @Param('id') id: string,
        @Body() dados: { nome?: string; email?: string; senha?: string }
    ): Promise<Usuario> {
        return this.usuarioService.atualizarUsuario(+id, dados);
    }

    @Delete(':id')
    async excluirUsuario(@Param('id') id: string) {
        return this.usuarioService.excluirUsuario(+id);
    }
} 