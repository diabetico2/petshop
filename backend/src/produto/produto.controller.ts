import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from 'generated/prisma';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async criarProduto(@Body() dados: CreateProdutoDto): Promise<Produto> {
    return this.produtoService.criarProduto(dados);
  }

  @Get()
  async listarProdutos(): Promise<Produto[]> {
    return this.produtoService.listarProdutos();
  }

  @Get(':id')
  async encontrarProduto(@Param('id') id: string): Promise<Produto> {
    const produto = await this.produtoService.encontrarProduto(+id);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    return produto;
  }

  @Get(':id/pet')
  async encontrarPetProduto(@Param('id') id: string) {
    return this.produtoService.encontrarPetProduto(+id);
  }

  @Patch(':id')
  async atualizarProduto(
    @Param('id') id: string,
    @Body() dados: UpdateProdutoDto
  ): Promise<Produto> {
    return this.produtoService.atualizarProduto(+id, dados);
  }

  @Delete(':id')
  async excluirProduto(@Param('id') id: string) {
    return this.produtoService.excluirProduto(+id);
  }
}
