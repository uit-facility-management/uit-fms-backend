import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomAsset } from 'src/room-assets/entities/room-asset.entity';
import { RoomAssetsService } from 'src/room-assets/room-assets.service';
import { RoomAssetsModule } from 'src/room-assets/room-assets.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]),RoomAssetsModule,ScheduleModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
