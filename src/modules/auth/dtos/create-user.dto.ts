import { IsNotEmpty, IsEmail, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { user_role, user_status } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome do usuário',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '123.456.789-00',
    description: 'CPF do usuário',
    required: false,
  })
  @IsNotEmpty()
  @IsOptional()
  cpf?: string;

  @ApiProperty({
    example: ['GUEST'],
    description: 'Array de roles do usuário. Valores possíveis: ADMIN, GUEST, HOST',
    required: false,
    isArray: true,
    enum: user_role,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(user_role, { each: true })
  role?: user_role[];

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Status do usuário. Valores possíveis: ACTIVE, INACTIVE, PENDENT',
    required: false,
    enum: user_status,
  })
  @IsOptional()
  @IsEnum(user_status)
  status?: user_status;
}
