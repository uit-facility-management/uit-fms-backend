import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Room } from 'src/room/entities/room.entity';
import { RoomAssetType } from '../entities/room-asset.entity';

export class CreateRoomAssetDto {
  @ApiProperty({
    example: 'Projector',
    description: 'Name of the room asset',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'Type of the room asset',
  })
  @IsString()
  type: RoomAssetType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the room',
  })
  @IsString()
  room_id: string;

  @ApiProperty({
    example: 'available',
    description: 'Status of the room asset',
  })
  @IsString()
  status: string;
}
