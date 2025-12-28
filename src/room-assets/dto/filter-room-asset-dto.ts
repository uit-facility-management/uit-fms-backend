import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { RoomAssetStatus, RoomAssetType } from '../entities/room-asset.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RoomAssetQueryDto {
  @ApiProperty({ required: false, description: 'Search query' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, enum: RoomAssetType, description: 'Type of the room asset' })
  @IsOptional()
  @IsEnum(RoomAssetType)
  type?: RoomAssetType;

  @ApiProperty({ required: false, enum: RoomAssetStatus, description: 'Status of the room asset' })
  @IsOptional()
  @IsEnum(RoomAssetStatus)
  status?: RoomAssetStatus;

  @ApiProperty({ required: false, description: 'ID of the room' })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiProperty({ required: false, description: 'ID of the building' })
  @IsOptional()
  @IsString()
  buildingId?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  page: number = 0;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  size: number = 10;

  @IsOptional()
  @IsString()
  sort?: string;
}
