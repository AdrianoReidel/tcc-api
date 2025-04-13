import { IsString, IsEmail, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MailInviteDto {
  @ApiProperty({
    description: 'Email do usuário a ser convidado',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'O email precisa ser válido' })
  email: string;

  @ApiProperty({
    description: 'Array de roles do usuário no sistema (ADMIN, GUEST, HOST)',
    example: ['GUEST'],
  })
  @IsArray({ message: 'O role precisa ser um array' })
  @IsString({ each: true, message: 'Cada role precisa ser uma string' })
  role: string[];
}
