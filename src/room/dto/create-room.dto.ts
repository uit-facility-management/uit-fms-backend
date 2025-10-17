import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    example: 'Conference Room A',
    description: 'Name of the room',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 'active', description: 'Status of the room' })
  @IsString()
  status: string;

  @ApiProperty({
    example: 3,
    description: 'Floor number where the room is located',
  })
  @IsNumber()
  stage: number;

  @ApiProperty({
    example: 'meeting',
    description: 'Type of the room',
  })
  @IsString()
  type: string;

  @ApiProperty({
    example: 10,
    description: 'Maximum capacity of the room',
  })
  @IsNumber()
  capacity: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the building',
  })
  @IsString()
  building_id: string;
}
