import { IsNotEmpty, IsNumber, IsString, Min, IsOptional, IsEnum } from 'class-validator';

export class CreateProdutoDto {
    @IsNotEmpty()
    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    descricao?: string;

    @IsNotEmpty()
    @IsEnum(['alimenticio', 'medicinal', 'higiene', 'alimentacao', 'brinquedo', 'outros'])
    tipo: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    preco: number;

    @IsOptional()
    @IsString()
    imagem?: string;

    @IsNotEmpty()
    @IsString()
    petId: string;

    @IsNotEmpty()
    @IsString()
    data_compra: string;

    @IsOptional()
    @IsString()
    observacoes?: string;

    @IsOptional()
    @IsNumber()
    quantidade_vezes?: number;

    @IsOptional()
    @IsString()
    quando_consumir?: string;
}
