import { Module } from '@nestjs/common';
import { RoomAssetsService } from './room-assets.service';
import { RoomAssetsController } from './room-assets.controller';

@Module({
  controllers: [RoomAssetsController],
  providers: [RoomAssetsService],
})
export class RoomAssetsModule {}
