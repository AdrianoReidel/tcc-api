import { ApiProperty } from '@nestjs/swagger';
import { review_type } from '@prisma/client';
import { IsInt, IsString, Min, Max, IsDateString, IsEnum } from 'class-validator';

export class ReviewResponseDto {
  @ApiProperty({ description: 'ID da avaliação', example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'ID da reserva associada', example: '12345' })
  @IsString()
  reservationId: string;

  @ApiProperty({ description: 'Nome do autor da avaliação', example: 'João Silva' })
  @IsString()
  authorName: string;

  @ApiProperty({ description: 'Nota da avaliação (1 a 5)', example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Comentário da avaliação', example: 'Ótima experiência!' })
  @IsString()
  comment: string;

  @ApiProperty({ description: 'Tipo da avaliação', example: 'GUEST_TO_HOST', enum: review_type })
  @IsEnum(review_type)
  type?: review_type;

  @ApiProperty({ description: 'Data de criação da avaliação', example: '2025-05-21T11:33:00.000Z' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Data de check-in da reserva', example: '2025-05-20T00:00:00.000Z' })
  @IsDateString()
  checkIn: Date;

  @ApiProperty({ description: 'Data de check-out da reserva', example: '2025-05-22T00:00:00.000Z' })
  @IsDateString()
  checkOut: Date;
}
