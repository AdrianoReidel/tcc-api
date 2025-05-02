import { ApiProperty } from '@nestjs/swagger';
import { operating_mode } from '@prisma/client';
import { IsEnum, IsNumber } from 'class-validator';

export class PropertyListDto {
  @ApiProperty({ example: 'UUID', description: 'ID da propriedade' })
  id: string;

  @ApiProperty({ example: 'Casa de Praia', description: 'Título da propriedade' })
  title: string;

  @ApiProperty({
    example: 'Uma linda casa com vista para o mar...',
    description: 'Descrição da propriedade',
  })
  description: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Data de criação da propriedade',
  })
  createdAt: Date;

  @ApiProperty({
    example: 'UUID',
    description: 'ID do host da propriedade',
  })
  hostId: string;

  @ApiProperty({ example: 250.0, description: 'Preço por unidade de aluguel da propriedade' })
  pricePerUnit: number;

  @ApiProperty({
    example: 'PER_NIGHT',
    description: 'Modo de operação da propriedade. Valores possíveis: PER_NIGHT, PER_HOUR, PER_DAY',
    required: false,
    enum: operating_mode,
  })
  @IsEnum(operating_mode)
  operatingMode?: operating_mode;

  @ApiProperty({
    example: 'HOUSING',
    description: 'Tipo da propriedade',
  })
  type: string;

  @ApiProperty({ example: 'Florianópolis', description: 'Cidade da propriedade' })
  city: string;

  @ApiProperty({ example: 'Santa Catarina', description: 'Estado da propriedade' })
  state: string;

  @ApiProperty({ description: 'Id da imagem de capa da propriedade' })
  photoId?: string;
}
