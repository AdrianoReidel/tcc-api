import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { property_type, property_status } from '@prisma/client';

export class UpdatePropertyDto {
  @ApiPropertyOptional({
    example: 'Casa de Praia',
    description: 'Título da propriedade',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: 'Uma linda casa com vista para o mar',
    description: 'Descrição da propriedade',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'APARTMENT',
    description: 'Tipo da propriedade (HOUSE, APARTMENT, ROOM, OTHER)',
  })
  @IsEnum(property_type)
  @IsOptional()
  type?: property_type;

  @ApiPropertyOptional({
    example: 'AVAILABLE',
    description: 'Status da propriedade (AVAILABLE, UNAVAILABLE)',
  })
  @IsEnum(property_status)
  @IsOptional()
  status?: property_status;

  @ApiPropertyOptional({
    example: 'Rua das Flores',
    description: 'Endereço (rua) da propriedade',
  })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiPropertyOptional({
    example: 'Rio de Janeiro',
    description: 'Cidade da propriedade',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    example: 'RJ',
    description: 'Estado da propriedade',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional({
    example: 'Brasil',
    description: 'País da propriedade',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    example: '12345-678',
    description: 'CEP da propriedade',
  })
  @IsString()
  @IsOptional()
  zipCode?: string;

  @ApiPropertyOptional({
    example: 250.0,
    description: 'Preço por noite da propriedade',
  })
  @IsNumber()
  @IsOptional()
  pricePerNight?: number;
}
