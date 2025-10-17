import { Injectable } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}
  create(createBuildingDto: CreateBuildingDto) {
    const building = this.buildingRepository.create(createBuildingDto);
    return this.buildingRepository.save(building);
  }

  findAll() {
    return this.buildingRepository.find();
  }

  findOne(id: string) {
    return this.buildingRepository.findOneBy({ id });
  }

  update(id: string, updateBuildingDto: UpdateBuildingDto) {
    return this.buildingRepository.update(id, updateBuildingDto);
  }

  remove(id: string) {
    return this.buildingRepository.delete(id);
  }
}
