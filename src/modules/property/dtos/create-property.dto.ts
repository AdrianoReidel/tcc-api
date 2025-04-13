import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Casa de Praia', description: 'Título da propriedade' })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string;

  @ApiProperty({
    example: 'Uma linda casa com vista para o mar.',
    description: 'Descrição da propriedade',
  })
  @IsString()
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description: string;

  @ApiProperty({
    example: 'APARTMENT',
    description: 'Tipo da propriedade',
  })
  @IsString()
  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  type: string;

  @ApiProperty({
    example: 'AVAILABLE',
    description: 'Status da propriedade',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'Rua das Flores', description: 'Endereço - rua da propriedade' })
  @IsString()
  @IsNotEmpty({ message: 'A rua é obrigatória.' })
  street: string;

  @ApiProperty({ example: 'Rio de Janeiro', description: 'Cidade da propriedade' })
  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  city: string;

  @ApiProperty({ example: 'RJ', description: 'Estado da propriedade' })
  @IsString()
  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  state: string;

  @ApiProperty({ example: 'Brasil', description: 'País da propriedade' })
  @IsString()
  @IsNotEmpty({ message: 'O país é obrigatório.' })
  country: string;

  @ApiProperty({ example: '12345-678', description: 'CEP da propriedade' })
  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  zipCode: string;

  @ApiProperty({ example: 250.0, description: 'Preço por noite da propriedade' })
  @IsNumber()
  @IsNotEmpty({ message: 'O preço por noite é obrigatório.' })
  pricePerNight: number;

  @ApiProperty({ example: 'UUID', description: 'ID do host da propriedade' })
  @IsString()
  @IsNotEmpty({ message: 'O ID do host é obrigatório.' })
  hostId: string;
}
