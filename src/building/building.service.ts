import { Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Repository } from 'typeorm';
import { RoomService } from 'src/room/room.service';
@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    private readonly roomService: RoomService
  ) {}
  async create(createBuildingDto: CreateBuildingDto) {
    const building = this.buildingRepository.create(createBuildingDto);
    return this.buildingRepository.save(building);
  }

  async findAll() {
    return this.buildingRepository.find();
  }
  async findRooms(building_id: string) {
    return this.roomService.findByBuilding(building_id);
  }
  findOne(id: string) {
    return this.buildingRepository.findOneBy({ id });
  }

  async update(id: string, updateBuildingDto: UpdateBuildingDto) {
    return this.buildingRepository.update(id, updateBuildingDto);
  }

  async remove(id: string) {
    return this.buildingRepository.delete(id);
  }
}
