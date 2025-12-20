import { ApiProperty } from '@nestjs/swagger';
import { RoomAsset } from 'src/room-assets/entities/room-asset.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Timestamp when the incident was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Timestamp when the incident was last updated',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  //relations
  @ManyToOne(() => RoomAsset, (roomAsset) => roomAsset.id)
  @JoinColumn({ name: 'room_asset_id' })
  room_asset: RoomAsset;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_user: User;
}
