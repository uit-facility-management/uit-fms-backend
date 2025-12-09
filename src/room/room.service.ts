import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { RoomAssetsService } from 'src/room-assets/room-assets.service';  
import { ScheduleService } from 'src/schedule/schedule.service';
import { IncidentService } from 'src/incident/incident.service';
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
    return this.roomRepository.find();
  }
  async findByBuilding(building_id: string) {
    return this.roomRepository.find({ where: { building_id } });
  }

  async findOne(id: string) {
    return this.roomRepository.findOne({ where: { id } });
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
