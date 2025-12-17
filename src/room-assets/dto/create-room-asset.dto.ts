import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Room } from 'src/room/entities/room.entity';
import { RoomAssetStatus, RoomAssetType } from '../entities/room-asset.entity';
import { Exclude, Type } from 'class-transformer';

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
  @IsEnum(RoomAssetType)
  type: RoomAssetType;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the room',
  })
  @IsString()
  room_id: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Status of the room asset',
  })
  @IsEnum(RoomAssetStatus)
  status: RoomAssetStatus;
}
export class RoomAssetResponseDto {
  id: string;
  name: string;
  status: RoomAssetStatus;

  @Type(() => Room)
  room: Room;

  @Exclude()
  room_id: string;
}
