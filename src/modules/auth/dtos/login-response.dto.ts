import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token JWT de refresh',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 'UUID',
  })
  userId: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'John',
  })
  name: string;

  @ApiProperty({
    description: 'Array de roles do usuário',
    example: ['GUEST'],
  })
  role: string[];
}
