import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
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

  @ApiProperty({
    example: '+55 11 99999-8888',
    description: 'Telefone principal do usuário',
    required: false,
  })
  phone?: string;

  @ApiProperty({ example: '123.456.789-00', description: 'CPF do usuário' })
  cpf: string;

  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    description: 'Data de nascimento',
    required: false,
  })
  birthDate?: Date;

  @ApiProperty({
    example: 'Rua Exemplo',
    description: 'Endereço do usuário',
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: '123',
    description: 'Número do endereço',
    required: false,
  })
  addressNumber?: string;

  @ApiProperty({
    example: 'Bairro Exemplo',
    description: 'Bairro',
    required: false,
  })
  neighborhood?: string;

  @ApiProperty({ example: '01234-567', description: 'CEP', required: false })
  postalCode?: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade', required: false })
  city?: string;

  @ApiProperty({
    example: 'Apto 101',
    description: 'Complemento do endereço',
    required: false,
  })
  addressComplement?: string;

  @ApiProperty({ example: 'SP', description: 'Estado', required: false })
  state?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Data de criação do registro',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    description: 'Data de atualização do registro',
  })
  updatedAt: Date;
}
