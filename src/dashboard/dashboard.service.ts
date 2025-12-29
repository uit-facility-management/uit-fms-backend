import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { RoomService } from 'src/room/room.service';
import { RoomAssetsService } from 'src/room-assets/room-assets.service';
import { BorrowTicketService } from 'src/borrow_ticket/borrow_ticket.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { IncidentService } from 'src/incident/incident.service';
@Injectable()
export class DashboardService {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomAssetsService: RoomAssetsService,
    private readonly borrowTicketService: BorrowTicketService,
    private readonly scheduleService: ScheduleService,
    private readonly incidentService: IncidentService,
  ) {}
  async getDashboard() {
    const rooms = await this.roomService.roomCount();
    const roomAssets = await this.roomAssetsService.roomAssetsCount();
    const borrowedTickets = await this.borrowTicketService.borrowedCount();
    const schedules = await this.scheduleService.scheduleCount();
    const incident = await this.incidentService.incidentCount();
    return {
      roomAssets,
      rooms,
      borrowedTickets,
      schedules,
      incident,
    };
  }
}
