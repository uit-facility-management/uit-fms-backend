import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { RoomModule } from 'src/room/room.module';
import { RoomAssetsModule } from 'src/room-assets/room-assets.module';
import { BorrowTicketModule } from 'src/borrow_ticket/borrow_ticket.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { IncidentModule } from 'src/incident/incident.module';

@Module({
  imports: [RoomModule,RoomAssetsModule,BorrowTicketModule,ScheduleModule,IncidentModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
