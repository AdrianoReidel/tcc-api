import { ApiProperty } from '@nestjs/swagger';

export class ReservationDto {
  @ApiProperty({ example: 'UUID', description: 'ID da reserva' })
  id: string;

  @ApiProperty({ example: 'UUID', description: 'ID da propriedade' })
  propertyId: string;

  @ApiProperty({ example: 'Casa de Praia', description: 'Nome da propriedade' })
  propertyTitle: string;

  @ApiProperty({ example: 'HOUSING', description: 'Tipo da propriedade' })
  propertyType: string;

  @ApiProperty({ example: '2025-05-17T00:00:00.000Z', description: 'Data de check-in' })
  checkIn: Date;

  @ApiProperty({ example: '2025-05-18T00:00:00.000Z', description: 'Data de check-out' })
  checkOut: Date;

  @ApiProperty({ example: 10, description: 'Horário selecionado (hora como inteiro, ex.: 10 para 10:00)' })
  selectedTime: number;

  @ApiProperty({ example: 250.0, description: 'Valor total pago pela reserva' })
  totalPrice: number;

  @ApiProperty({ example: 'PENDING', description: 'Status da reserva (PENDING, PAID, CANCELED)' })
  status: string;
}