import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
export class RegisterDto {
  @ApiProperty({
    example: 'JohnDoe',
    description: 'Username of the user',
  })
  @IsString()
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email of the user',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
  })
  @IsString()
  password: string;
}