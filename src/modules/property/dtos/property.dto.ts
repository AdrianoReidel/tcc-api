import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'APARTMENT', description: 'Tipo da propriedade' })
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

  @ApiProperty({ example: 250.0, description: 'Preço por noite da propriedade' })
  pricePerNight: number;

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
}
