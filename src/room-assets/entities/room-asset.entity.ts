import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/room/entities/room.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
export enum RoomAssetType {
  ELECTRONICS = 'Electronics',
  FURNITURE = 'Furniture',
  STATIONERY = 'Stationery',
  OTHER = 'Other',
}
export enum RoomAssetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}
@Entity()
export class RoomAsset {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the room asset',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Projector', description: 'Name of the room asset' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'Type of the room asset',
  })
  @Column({ type: 'varchar', length: 100 })
  type: RoomAssetType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the room',
  })
  @Column({ type: 'uuid',select:false })
  room_id: string;

  @ApiProperty({
    example: 'available',
    description: 'Status of the room asset',
  })
  @Column({ type: 'varchar', length: 50 })
  status: RoomAssetStatus;

  //relationships
  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
