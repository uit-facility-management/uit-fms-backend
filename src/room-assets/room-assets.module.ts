import { Module } from '@nestjs/common';
import { RoomAssetsService } from './room-assets.service';
import { RoomAssetsController } from './room-assets.controller';
import { Type } from 'class-transformer';
import { RoomAsset } from './entities/room-asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RoomAsset])],
  controllers: [RoomAssetsController],
  providers: [RoomAssetsService],
})
export class RoomAssetsModule {}
