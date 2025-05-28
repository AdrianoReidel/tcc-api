import { IsInt, IsString, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ description: 'Nota da avaliação (1 a 5)', example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Comentário da avaliação', example: 'Ótima experiência!' })
  @IsString()
  comment: string;

  @ApiProperty({ description: 'ID da reserva associada (opcional)', example: '12345', required: false })
  @IsOptional()
  @IsString()
  reservationId?: string;

  @ApiProperty({ description: 'ID do usuário que está sendo avaliado', example: '67890' })
  @IsString()
  @IsOptional()
  guestId?: string;

  @ApiProperty({ description: 'ID da propriedade que está sendo avaliada', example: '12345' })
  @IsString()
  @IsOptional()
  propertyId?: string;
}
