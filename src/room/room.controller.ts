import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FilterRoomDto } from './dto/filter-room.dto';

@Controller('api/v1/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }
  @Get(':id/incidents')
  findRoomIncidents(@Param('id') id: string) {
    return this.roomService.findRoomIncidents(id);
  }

  @Get('free')
  findFreeRooms(@Query() filter: FilterRoomDto) {
    return this.roomService.findFreeRooms(filter);
  }

  @Get(':id/assets')
  findRoomAssets(@Param('id') id: string) {
    return this.roomService.findRoomAssets(id);
  }
  @Get(':id/schedules')
  findRoomSchedules(@Param('id') id: string) {
    return this.roomService.findRoomSchedules(id);
  }
  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
