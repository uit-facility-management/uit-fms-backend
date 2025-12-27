import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateBorrowTicketDto } from './dto/create-borrow_ticket.dto';
import { UpdateBorrowTicketDto } from './dto/update-borrow_ticket.dto';
import {
  BorrowTicket,
  BorrowTicketStatus,
} from './entities/borrow_ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceService } from 'src/device/device.service';

@Injectable()
export class BorrowTicketService {
  private readonly logger = new Logger(BorrowTicketService.name);
  constructor(
    @InjectRepository(BorrowTicket)
    private readonly borrowTicketRepository: Repository<BorrowTicket>,
    @Inject(forwardRef(() => DeviceService))
    private readonly deviceService: DeviceService,
  ) {}
  async create(createBorrowTicketDto: CreateBorrowTicketDto) {
    const borrowTicket = this.borrowTicketRepository.create(
      createBorrowTicketDto,
    );
    await this.deviceService.borrow(createBorrowTicketDto.device_id);
    return this.borrowTicketRepository.save(borrowTicket);
  }

  async findByDeviceId(deviceId: string) {
    return this.borrowTicketRepository.find({
      where: { device: { id: deviceId } },
      relations: ['device', 'room', 'user', 'student'],
    });
  }
  async returnDevice(id: string) {
    this.logger.log(`Returning device for borrow ticket ID: ${id}`);
    const borrowTicket = await this.borrowTicketRepository.findOne({
      where: { id },
      relations: ['device'],
    });

    if (borrowTicket) {
      borrowTicket.returned_at = new Date();
      borrowTicket.status = BorrowTicketStatus.RETURNED;
      await this.deviceService.returnDevice(borrowTicket.device.id);
      return this.borrowTicketRepository.save(borrowTicket);
    }
    return null;
  }

  async findAll() {
    return this.borrowTicketRepository.find({
      relations: ['device', 'room', 'user', 'student'],
    });
  }

  async findOne(id: string) {
    return this.borrowTicketRepository.findOne({
      where: { id },
      relations: ['device', 'room', 'user', 'student'],
    });
  }

  async update(id: string, updateBorrowTicketDto: UpdateBorrowTicketDto) {
    const updatedBorrowTicket = await this.borrowTicketRepository.save({
      id,
      ...updateBorrowTicketDto,
    });
    return updatedBorrowTicket;
  }

  remove(id: string) {
    const result = this.borrowTicketRepository.delete(id);
    return result;
  }
}
