import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
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
  email: string;
}
export class SignInDto {
  @ApiProperty({
    example: 'JohnDoe',
    description: 'Username of the user',
  })
  username: string;

  @ApiProperty({
    example: 'hashedpassword123',
    description: 'Hashed password of the user',
  })
  password: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    example: 'newhashedpassword123',
    description: 'New hashed password of the user',
  })
  password: string;
}