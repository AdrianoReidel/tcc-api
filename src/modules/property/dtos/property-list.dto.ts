import { ApiProperty } from '@nestjs/swagger';

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
}
