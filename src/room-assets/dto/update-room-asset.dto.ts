import { PartialType } from '@nestjs/swagger';
import { CreateRoomAssetDto } from './create-room-asset.dto';

export class UpdateRoomAssetDto extends PartialType(CreateRoomAssetDto) {}
