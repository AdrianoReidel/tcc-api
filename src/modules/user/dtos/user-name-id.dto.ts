import { ApiProperty } from '@nestjs/swagger';

export class UserNameIdDto {
  @ApiProperty({ example: 'UUID' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;
}
