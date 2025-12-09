import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum IncidentStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
}
@Entity()
export class Incident {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the incident',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ApiProperty({
    example: 'Leaking Faucet',
    description: 'Title of the incident',
  })
  @Column('text')
  title: string;
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Unique identifier for the room associated with the incident',
  })
  @Column('uuid')
  room_id: string;

  @ApiProperty({
    example: 'Leaking faucet in the restroom',
    description: 'Description of the incident',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description:
      'Unique identifier for the room asset associated with the incident',
  })
  @Column('uuid')
  room_asset_id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'Unique identifier for the user who created the incident',
  })
  @Column('uuid')
  created_by: string;

  @ApiProperty({
    example: 'pending',
    description: 'Status of the incident',
  })
  @Column('enum', { enum: IncidentStatus, default: IncidentStatus.PENDING })
  status: IncidentStatus;
}
