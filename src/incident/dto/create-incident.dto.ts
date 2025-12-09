import { ApiProperty } from '@nestjs/swagger';
import { IncidentStatus } from '../entities/incident.entity';
import { IsEnum, IsString } from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({
    example: 'Leaking Faucet',
    description: 'Title of the incident',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Leaking faucet in the restroom',
    description: 'Description of the incident',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Unique identifier for the room associated with the incident',
  })
  @IsString()
  room_id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description:
      'Unique identifier for the room asset associated with the incident',
  })
  @IsString()
  room_asset_id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'Unique identifier for the user who created the incident',
  })
  @IsString()
  created_by: string;

  @ApiProperty({
    example: 'pending',
    description: 'Status of the incident',
  })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;
}
