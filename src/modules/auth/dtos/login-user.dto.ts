import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
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
}
