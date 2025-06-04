import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';
import { Matches } from 'class-validator';

export class UpdatePetDto extends PartialType(CreatePetDto) {
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'por favor, insira apenas letras e espaços',
  })
  nome?: string;

  @Matches(/^[\p{L}\s]+$/u, {
    message: 'por favor, insira apenas letras e espaços',
  })
  raca?: string;
}
