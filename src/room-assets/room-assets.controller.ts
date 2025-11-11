import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomAssetsService } from './room-assets.service';
import { CreateRoomAssetDto } from './dto/create-room-asset.dto';
import { UpdateRoomAssetDto } from './dto/update-room-asset.dto';

@Controller('room-assets')
export class RoomAssetsController {
  constructor(private readonly roomAssetsService: RoomAssetsService) {}

  @Post()
  create(@Body() createRoomAssetDto: CreateRoomAssetDto) {
    return this.roomAssetsService.create(createRoomAssetDto);
  }

  @Get()
  findAll() {
    return this.roomAssetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomAssetsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomAssetDto: UpdateRoomAssetDto,
  ) {
    return this.roomAssetsService.update(id, updateRoomAssetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomAssetsService.remove(id);
  }
}
