import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'senha123', required: false })
  @IsNotEmpty()
  @IsString()
  password: string;
}
