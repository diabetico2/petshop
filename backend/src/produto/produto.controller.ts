import {
  Controller,
  Get,
  Post,
  Body,
  Put,
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
  async listarProdutos(): Promise<any[]> {
    const produtos = await this.produtoService.listarProdutos();
    return produtos.map(p => ({
      ...p,
      petId: p.petid,
    }));
  }

  @Get(':id')
  async encontrarProduto(@Param('id') id: string): Promise<Produto> {
    const produto = await this.produtoService.encontrarProduto(id);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    return produto;
  }

  @Put(':id')
  async atualizarProduto(
    @Param('id') id: string,
    @Body() dados: UpdateProdutoDto
  ): Promise<Produto> {
    return this.produtoService.atualizarProduto(id, dados);
  }

  @Delete(':id')
  async excluirProduto(@Param('id') id: string) {
    return this.produtoService.excluirProduto(id);
  }
}
