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
  async encontrarPet(@Param('id') idPet: string) {
    return this.petService.encontrarPet(idPet);
  }

  @Get(':id/produtos')
  async encontrarProdutosPet(@Param('id') idPet: string) {
    return this.petService.encontrarProdutosPet(idPet);
  }

  @Post()
  async postPet(@Body() dados: CreatePetDto): Promise<ModelPet> {
    return this.petService.criarPet(dados);
  }

  @Patch(':id')
  async atualizarPet(@Param('id') idPet: string, @Body() dados: UpdatePetDto) {
    return this.petService.atualizarPet(idPet, dados);
  }

  @Delete(':id')
  async excluirPet(@Param('id') idPet: string) {
    return this.petService.excluirPet(idPet);
  }
}
