import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptInviteDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'token',
    description: 'Token de convite',
    required: true,
  })
  @IsNotEmpty()
  token: string;
}
