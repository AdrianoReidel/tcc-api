import { ApiProperty } from '@nestjs/swagger';

export class PhotoResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da foto' })
  id: string;

  @ApiProperty({ example: 'binary-data', description: 'Dados binários da foto (Buffer)' })
  data: Buffer;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID da propriedade' })
  propertyId: string;
}