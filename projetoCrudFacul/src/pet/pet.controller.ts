import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Pet as ModelPet } from 'generated/prisma';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get()
  async getPets(): Promise<ModelPet[]> {
    return this.petService.listarPets();
  }

  @Get(':id')
  async getPetById(@Param('id', ParseIntPipe) idPet: number): Promise<ModelPet> {
    return this.petService.encontrarPet(idPet);
  }

  @Get('produtos/:id')
  async getProdutosPetById(@Param('id', ParseIntPipe) idPet: number): Promise<any> {
    return this.petService.encontrarProdutosPet(idPet);
  }

  @Post()
  async postPet(@Body() dados: CreatePetDto): Promise<ModelPet> {
    return this.petService.criarPet(dados);
  }

  @Patch(':id')
  async updatePet(
    @Param('id', ParseIntPipe) idPet: number,
    @Body() dados: UpdatePetDto
  ): Promise<ModelPet> {
    return this.petService.atualizarPet(idPet, dados);
  }

  @Delete(':id')
  async deletePet(@Param('id', ParseIntPipe) idPet: number) {
    return this.petService.excluirPet(idPet);
  }
}
