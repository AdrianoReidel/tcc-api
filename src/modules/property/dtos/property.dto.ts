import { ApiProperty } from '@nestjs/swagger';
import { operating_mode } from '@prisma/client';

export class PropertyDto {
  @ApiProperty({ example: 'UUID', description: 'ID da propriedade' })
  id: string;

  @ApiProperty({ example: 'Casa de Praia', description: 'Título da propriedade' })
  title: string;

  @ApiProperty({
    example: 'Uma linda casa com vista para o mar.',
    description: 'Descrição da propriedade',
  })
  description: string;

  @ApiProperty({
    example: 'HOUSING',
    description: 'Tipo da propriedade (HOUSING, EVENTS, SPORTS)',
  })
  type: string;

  @ApiProperty({ example: 'AVAILABLE', description: 'Status da propriedade' })
  status: string;

  @ApiProperty({ example: 'Rua das Flores', description: 'Endereço - rua da propriedade' })
  street: string;

  @ApiProperty({ example: 'Rio de Janeiro', description: 'Cidade da propriedade' })
  city: string;

  @ApiProperty({ example: 'RJ', description: 'Estado da propriedade' })
  state: string;

  @ApiProperty({ example: 'Brasil', description: 'País da propriedade' })
  country: string;

  @ApiProperty({ example: '12345-678', description: 'CEP da propriedade' })
  zipCode: string;

  @ApiProperty({ example: 250.0, description: 'Preço por unidade de aluguel da propriedade' })
  pricePerUnit: number;

  @ApiProperty({ example: 'UUID', description: 'ID do host da propriedade' })
  hostId: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Data de criação do registro',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    description: 'Data de atualização do registro',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 'PER_NIGHT',
    description: 'Modo de operação da propriedade. Valores possíveis: PER_NIGHT, PER_HOUR, PER_DAY',
    required: false,
    enum: operating_mode,
  })
  operatingMode?: operating_mode;

  @ApiProperty({
    example: ['photo1-id', 'photo2-id'],
    description: 'Vetor de IDs das fotos associadas à propriedade',
  })
  photoIds: string[];
}
