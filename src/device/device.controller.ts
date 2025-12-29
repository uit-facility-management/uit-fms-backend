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
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Device, DeviceStatus } from './entities/device.entity';

@Controller('api/v1/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @Get()
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'status', required: false, enum: DeviceStatus })
  findAll(
    @Query('q') q?: string,
    @Query('status') status?: DeviceStatus,
  ) {
    return this.deviceService.findAll(q, status);
  }

  @Get(':id/borrow-tickets')
  findBorrowTickets(@Param('id') id: string) {
    return this.deviceService.findBorrowTicketes(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceService.remove(id);
  }
}
