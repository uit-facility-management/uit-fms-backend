import { Injectable } from '@nestjs/common';
import {
  CreateRoomAssetDto,
  RoomAssetResponseDto,
} from './dto/create-room-asset.dto';
import { UpdateRoomAssetDto } from './dto/update-room-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomAsset, RoomAssetStatus } from './entities/room-asset.entity';
import { Brackets, Repository } from 'typeorm';
import { RoomAssetQueryDto } from './dto/filter-room-asset-dto';

@Injectable()
export class RoomAssetsService {
  constructor(
    @InjectRepository(RoomAsset)
    private roomAssetsRepository: Repository<RoomAsset>,
  ) {}
  async create(createRoomAssetDto: CreateRoomAssetDto) {
    const roomAsset = this.roomAssetsRepository.create(createRoomAssetDto);
    return this.roomAssetsRepository.save(roomAsset);
  }
  async updateStatus(id: string, status: RoomAssetStatus) {
    return this.roomAssetsRepository.update(id, { status });
  }
  async findByRoom(room_id: string) {
    return this.roomAssetsRepository.find({
      where: { room: { id: room_id } },
      relations: ['room'],
    });
  }

  async findAll(query?: RoomAssetQueryDto) {
    if (!query) {
      const roomAssets = await this.roomAssetsRepository.find({
        relations: ['room', 'room.building'],
      });
      return roomAssets;
    }
    const qb = this.roomAssetsRepository
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.room', 'room')
      .leftJoinAndSelect('room.building', 'building');

    if (query.q?.trim()) {
      const keyword = `%${query.q.trim()}%`;
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('asset.name ILIKE :keyword', { keyword })
            .orWhere('asset.type ILIKE :keyword', { keyword });
        }),
      );
    }

    // ✅ Filters
    if (query.type) qb.andWhere('asset.type = :type', { type: query.type });
    if (query.status)
      qb.andWhere('asset.status = :status', { status: query.status });
    if (query.roomId)
      qb.andWhere('room.id = :roomId', { roomId: query.roomId });
    if (query.buildingId)
      qb.andWhere('building.id = :buildingId', { buildingId: query.buildingId });
    
    // ✅ No paging
    const items = await qb.getMany();
    return items;
  }

  async findOne(id: string) {
    return this.roomAssetsRepository.findOne({
      where: { id },
      relations: ['room'],
    });
  }

  async update(id: string, updateRoomAssetDto: UpdateRoomAssetDto) {
    return this.roomAssetsRepository.update(id, updateRoomAssetDto);
  }

  async remove(id: string) {
    return this.roomAssetsRepository.delete(id);
  }
}
