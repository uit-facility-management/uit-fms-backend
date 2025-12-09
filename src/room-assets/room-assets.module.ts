import { Module } from '@nestjs/common';
import { RoomAssetsService } from './room-assets.service';
import { RoomAssetsController } from './room-assets.controller';
import { RoomAsset } from './entities/room-asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from 'src/room/room.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomAsset])],
  controllers: [RoomAssetsController],
  providers: [RoomAssetsService],
  exports: [RoomAssetsService],
})
export class RoomAssetsModule {}
