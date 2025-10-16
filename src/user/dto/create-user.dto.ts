import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'JohnDoe', description: 'Username of the user' })
  @IsString()
  name: string;
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
    example: 'hashedpassword123',
    description: 'Hashed password of the user',
  })
  @IsString()
  password: string;
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
