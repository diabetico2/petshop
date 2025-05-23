import { IsNotEmpty, IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class CreateProdutoDto {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsNotEmpty()
    @IsString()
    tipo: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    preco: number;

    @IsOptional()
    @IsNumber()
    petId?: number;
}
