import { ApiProperty } from '@nestjs/swagger';
import { user_role, user_status } from '@prisma/client';
import { IsString, IsEmail, IsNotEmpty, IsArray, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
  })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido.' })
  @IsNotEmpty({ message: 'O email é obrigatório.' })
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string;

  @ApiProperty({ example: '123.456.789-00', description: 'CPF do usuário' })
  @IsString()
  cpf: string;

  @ApiProperty({
    example: ['GUEST'],
    description: 'Roles do usuário. Valores possíveis: ADMIN, GUEST, HOST',
    default: ['GUEST'],
    isArray: true,
  })
  @IsArray({ message: 'O role deve ser um array.' })
  @IsEnum(user_role, { each: true, message: 'Cada role deve ser um valor válido.' })
  role: user_role[] = ['GUEST'];

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Status do usuário. Valores possíveis: ACTIVE, INACTIVE, PENDENT',
    default: 'ACTIVE',
  })
  @IsString()
  status: user_status = 'ACTIVE';
}
