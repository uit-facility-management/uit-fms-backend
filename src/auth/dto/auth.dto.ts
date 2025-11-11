import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: 'Hashed password of the user',
  })
  password: string;
}
