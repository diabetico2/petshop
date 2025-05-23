import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProdutoDto {
    @IsOptional()
    @IsString()
    nome?: string;

    @IsOptional()
    @IsString()
    tipo?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    preco?: number;
}
