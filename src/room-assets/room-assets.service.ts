import { Injectable } from '@nestjs/common';
import { CreateRoomAssetDto } from './dto/create-room-asset.dto';
import { UpdateRoomAssetDto } from './dto/update-room-asset.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomAsset } from './entities/room-asset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomAssetsService {
  constructor(
    @InjectRepository(RoomAsset)
    private roomAssetsRepository: Repository<RoomAsset>,
  ) {}
  create(createRoomAssetDto: CreateRoomAssetDto) {
    const roomAsset = this.roomAssetsRepository.create(createRoomAssetDto);
    return this.roomAssetsRepository.save(roomAsset);
  }

  findAll() {
    return this.roomAssetsRepository.find();
  }

  findOne(id: string) {
    return this.roomAssetsRepository.findOneBy({ id });
  }

  update(id: string, updateRoomAssetDto: UpdateRoomAssetDto) {
    return this.roomAssetsRepository.update(id, updateRoomAssetDto);
  }

  remove(id: string) {
    return this.roomAssetsRepository.delete(id);
  }
}
