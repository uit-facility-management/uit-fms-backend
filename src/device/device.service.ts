import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Device, DeviceStatus } from './entities/device.entity';
import { Brackets, Repository } from 'typeorm';
import { BorrowTicketService } from 'src/borrow_ticket/borrow_ticket.service';
import { DeviceQueryDto } from './dto/search-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @Inject(forwardRef(() => BorrowTicketService))
    private readonly borrowTicketService: BorrowTicketService,
  ) {}
  async borrow(deviceId: string) {
    const device = await this.deviceRepository.findOneBy({ id: deviceId });
    if (device) {
      device.status = DeviceStatus.BORROWING;
      return this.deviceRepository.save(device);
    }
  }
  async returnDevice(deviceId: string) {
    const device = await this.deviceRepository.findOneBy({ id: deviceId });
    if (device) {
      device.status = DeviceStatus.ACTIVE;
      return this.deviceRepository.save(device);
    }
  }
  create(createDeviceDto: CreateDeviceDto) {
    const device = this.deviceRepository.create(createDeviceDto);
    return this.deviceRepository.save(device);
  }

  // findAll(status?: DeviceStatus) {
  //   const devices = this.deviceRepository.find({
  //     where: status ? { status } : {},
  //   });
  //   return devices;
  // }

  async findAll(q?: string, status?: DeviceStatus) {
    if (!q) {
      const devices = this.deviceRepository.find({
        where: status ? { status } : {},
      });
      return devices;
    }
    const qb = this.deviceRepository.createQueryBuilder('device');

    if (q?.trim()) {
      const keyword = `%${q.trim()}%`;
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .where('device.name ILIKE :keyword', { keyword })
            .orWhere('device.description ILIKE :keyword', { keyword })
            .orWhere('device.id::text ILIKE :keyword', { keyword })
            .orWhere('device.status::text ILIKE :keyword', { keyword });
        }),
      );
    }

    if (status) {
      qb.andWhere('device.status = :status', { status });
    }

    return qb.orderBy('device.updatedAt', 'DESC').getMany();
  }


  async findBorrowTicketes(deviceId: string) {
    const device = await this.borrowTicketService.findByDeviceId(deviceId);
    return device;
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
