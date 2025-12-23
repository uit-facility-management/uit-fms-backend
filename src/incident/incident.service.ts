import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident, IncidentStatus } from './entities/incident.entity';
import { In, Repository } from 'typeorm';
import {
  RoomAsset,
  RoomAssetStatus,
} from 'src/room-assets/entities/room-asset.entity';
import { RoomAssetsService } from 'src/room-assets/room-assets.service';

@Injectable()
export class IncidentService {
  private readonly logger = new (require('@nestjs/common').Logger)(
    IncidentService.name,
  );
  constructor(
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    private roomAssetsService: RoomAssetsService,
  ) {}
  async create(createIncidentDto: CreateIncidentDto) {
    const incident = this.incidentRepository.create(createIncidentDto);
    this.roomAssetsService.updateStatus(
      createIncidentDto.room_asset_id,
      RoomAssetStatus.INACTIVE,
    );
    return this.incidentRepository.save(incident);
  }

  async findByRoom(room_id: string) {
    return this.incidentRepository.find({
      where: { room_asset: { room: { id: room_id } } },
      relations: ['room_asset', 'room_asset.room', 'created_user'],
    });
  }
  async findAll() {
    return this.incidentRepository.find({
      relations: ['room_asset', 'room_asset.room', 'created_user'],
    });
  }

  async findOne(id: string) {
    const incident = await this.incidentRepository.findOneBy({ id });
    if (!incident) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }
    return incident;
  }

  async updateStatus(id: string, status: IncidentStatus) {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ['room_asset'],
    });
    if (!incident) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }

    if (status === IncidentStatus.RESOLVED ) {
      await this.roomAssetsService.updateStatus(
        incident.room_asset.id,
        RoomAssetStatus.ACTIVE,
      );
    }
    incident.status = status;
    return this.incidentRepository.save(incident);
  }
  async update(id: string, updateIncidentDto: UpdateIncidentDto) {
    const incident = await this.incidentRepository.findOneBy({ id });
    if (!incident) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }
    return this.incidentRepository.update(id, updateIncidentDto);
  }

  async remove(id: string) {
    return this.incidentRepository.delete(id);
  }
}
