import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { RoomAssetsService } from 'src/room-assets/room-assets.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { IncidentService } from 'src/incident/incident.service';
import { FilterRoomDto } from './dto/filter-room.dto';
@Injectable()
export class RoomService {
  constructor(
    private readonly incidentService: IncidentService,
    private readonly scheduleService: ScheduleService,
    private readonly roomAssetService: RoomAssetsService,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }
  async roomCount() {
    const totalRooms = await this.roomRepository.count();
    const availableRooms = await this.roomRepository.countBy({
      status: 'active',
    });
    return { totalRooms, availableRooms };
  }

  async findFreeRooms(filter: FilterRoomDto) {
    return this.roomRepository
      .createQueryBuilder('room')
      .where((qb) => {
        const sub = qb
          .subQuery()
          .select('s.room_id')
          .from('schedule', 's')
          .where('DATE(s.start_time) <= DATE(:end)', { end: filter.end_time })
          .andWhere('DATE(s.end_time) >= DATE(:start)', {
            start: filter.start_time,
          })
          .andWhere('s.period_start < :periodEnd', {
            periodEnd: filter.period_end,
          })
          .andWhere('s.period_end > :periodStart', {
            periodStart: filter.period_start,
          })
          .andWhere('day_of_week = :dayOfWeek', {
            dayOfWeek: filter.day_of_week,
          })
          .getQuery();

        return `room.id NOT IN ${sub}`;
      })
      .getMany();
  }

  async findRoomIncidents(room_id: string) {
    return this.incidentService.findByRoom(room_id);
  }
  async findRoomAssets(room_id: string) {
    return this.roomAssetService.findByRoom(room_id);
  }
  async findRoomSchedules(room_id: string) {
    return this.scheduleService.findByRoom(room_id);
  }
  async findAll() {
    const rooms = await this.roomRepository.find({
      relations: ['building'],
    });
    return rooms;
  }
  async findByBuilding(building_id: string) {
    return this.roomRepository.find({ where: { building_id } });
  }

  async findOne(id: string) {
    return this.roomRepository.findOne({
      where: { id },
      relations: ['building'],
    });
  }
  async update(id: string, updateRoomDto: UpdateRoomDto) {
    await this.roomRepository.update(id, updateRoomDto);
    return this.roomRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.roomRepository.delete(id);
    return { deleted: true };
  }
}
