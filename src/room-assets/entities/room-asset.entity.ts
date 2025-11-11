import { ApiProperty } from '@nestjs/swagger';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class RoomAsset {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the room asset',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Projector', description: 'Name of the room asset' })
  name: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'Type of the room asset',
  })
  type: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the room',
  })
  room_id: string;

  @ApiProperty({
    example: 'available',
    description: 'Status of the room asset',
  })
  status: string;

  //relationships
  @ManyToOne(() => RoomAsset, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: RoomAsset;
}
