import { ApiProperty } from '@nestjs/swagger';

export class UserListDto {
  @ApiProperty({ example: 'UUID', description: 'ID do usuário' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: ['GUEST'],
    description: 'Funções do usuário (ADMIN, GUEST, HOST)',
  })
  role: string[];

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Status do usuário (ACTIVE, INACTIVE, PENDENT)',
  })
  status: string;
}
