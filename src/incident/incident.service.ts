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
      order: { status: 'ASC' },
    });
  }

  async findAll() {
    return this.incidentRepository.find({
      relations: ['room_asset', 'room_asset.room', 'created_user'],
      order: { status: 'ASC' },
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

    if (status === IncidentStatus.RESOLVED) {
      await this.roomAssetsService.updateStatus(
        incident.room_asset.id,
        RoomAssetStatus.ACTIVE,
      );
    }
    incident.status = status;
    return this.incidentRepository.save(incident);
  }

  async incidentCount() {
    const now = new Date();
    const from = await this.getStartOfWeek(now);
    const to = await this.getEndOfWeek(now);
    const year = new Date().getFullYear();

    // Lấy dữ liệu từ database
    const weeklyIncidentsRaw = await this.incidentRepository
      .createQueryBuilder('incident')
      .select("DATE_TRUNC('day', incident.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('incident.createdAt BETWEEN :from AND :to', { from, to })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const monthlyIncidentsRaw = await this.incidentRepository
      .createQueryBuilder('incident')
      .select('EXTRACT(MONTH FROM incident.createdAt)', 'month')
      .addSelect('COUNT(*)', 'count')
      .where('EXTRACT(YEAR FROM incident.createdAt) = :year', { year })
      .groupBy('EXTRACT(MONTH FROM incident.createdAt)')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Tạo map để tra cứu nhanh
    const weeklyMap = new Map(
      weeklyIncidentsRaw.map((item) => [
        new Date(item.date).toISOString().split('T')[0],
        parseInt(item.count),
      ]),
    );

    const monthlyMap = new Map(
      monthlyIncidentsRaw.map((item) => [
        parseInt(item.month),
        parseInt(item.count),
      ]),
    );

    // Tạo mảng đầy đủ 7 ngày trong tuần
    const weeklyIncidents: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(from);
      date.setDate(from.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      weeklyIncidents.push({
        date: date.toISOString(),
        count: weeklyMap.get(dateStr) || 0,
      });
    }

    // Tạo mảng đầy đủ 12 tháng trong năm
    const monthlyIncidents: { month: number; count: number }[] = [];
    for (let month = 1; month <= 12; month++) {
      monthlyIncidents.push({
        month: month,
        count: monthlyMap.get(month) || 0,
      });
    }

    const pendingIncidents = await this.incidentRepository.countBy({
      status: IncidentStatus.PENDING,
    });

    return { pendingIncidents, weeklyIncidents, monthlyIncidents };
  }

  async getStartOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 = CN, 1 = T2
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async getEndOfWeek(date: Date) {
    const start = await this.getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
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
