import { IsString, IsOptional, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ description: 'Data de início da reserva (formato ISO 8601)', example: '2025-05-16' })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Data de fim da reserva (formato ISO 8601), opcional para esportes',
    example: '2025-05-18',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Horário selecionado (em minutos desde meia-noite), obrigatório para esportes',
    example: 600,
    required: false,
  })
  @IsInt()
  @IsOptional()
  selectedTime?: number;
}
