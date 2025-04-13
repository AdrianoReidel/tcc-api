import { ApiProperty } from '@nestjs/swagger';

export class UserAuthDto {
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
    example: 'GUEST',
    description: 'Role do usuário. Valores possíveis: ADMIN, GUEST, HOST',
  })
  role: string[];
}
