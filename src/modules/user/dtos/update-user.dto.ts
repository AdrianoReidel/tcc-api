import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'P@ssw0rd!',
    description: 'Senha do usuário',
  })
  @IsString()
  @IsOptional()
  // @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password?: string;

  @ApiProperty({
    example: 'GUEST',
    description: 'Role do usuário. Valores possíveis: ADMIN, GUEST, HOST',
    default: 'GUEST',
  })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    example: 'ACTIVE',
    description: 'Status do usuário. Valores possíveis: ACTIVE, INACTIVE, PENDENT',
    default: 'ACTIVE',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
