import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}
  create(createDeviceDto: CreateDeviceDto) {
    const device = this.deviceRepository.create(createDeviceDto);
    return this.deviceRepository.save(device);
  }

  findAll() {
    const devices = this.deviceRepository.find();
    return devices;
  }

  findOne(id: string) {
    const device = this.deviceRepository.findOneBy({ id });
    return device;
  }

  update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const updatedDevice = this.deviceRepository.save({
      id,
      ...updateDeviceDto,
    });
    return updatedDevice;
  }

  remove(id: string) {
    return this.deviceRepository.delete(id);
  }
}
