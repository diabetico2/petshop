import { IsNumber, IsOptional, IsString, Min, IsEnum } from 'class-validator';

export class UpdateProdutoDto {
    @IsOptional()
    @IsString()
    nome?: string;

    @IsOptional()
    @IsString()
    descricao?: string;

    @IsOptional()
    @IsEnum(['alimenticio', 'medicinal', 'higiene', 'alimentacao', 'brinquedo', 'outros'])
    tipo?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    preco?: number;

    @IsOptional()
    @IsString()
    imagem?: string;

    @IsOptional()
    @IsString()
    petId?: string;

    @IsOptional()
    @IsString()
    data_compra?: string;

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
