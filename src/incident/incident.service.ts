import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from './entities/incident.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
  ) {}
  async create(createIncidentDto: CreateIncidentDto) {
    const incident = this.incidentRepository.create(createIncidentDto);
    return this.incidentRepository.save(incident);
  }

  async findByRoom(room_id: string) {
    return this.incidentRepository.find({ where: { room_id } });
  }
  async findAll() {
    return this.incidentRepository.find();
  }

  async findOne(id: string) {
    const incident = await this.incidentRepository.findOneBy({ id });
    if (!incident) {
      throw new NotFoundException(`Incident with id ${id} not found`);
    }
    return incident;
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
