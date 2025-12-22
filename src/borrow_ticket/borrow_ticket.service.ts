import { Inject, Injectable } from '@nestjs/common';
import { CreateBorrowTicketDto } from './dto/create-borrow_ticket.dto';
import { UpdateBorrowTicketDto } from './dto/update-borrow_ticket.dto';
import {
  BorrowTicket,
  BorrowTicketStatus,
} from './entities/borrow_ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BorrowTicketService {
  constructor(
    @InjectRepository(BorrowTicket)
    private readonly borrowTicketRepository: Repository<BorrowTicket>,
  ) {}
  async create(createBorrowTicketDto: CreateBorrowTicketDto) {
    const borrowTicket = this.borrowTicketRepository.create(
      createBorrowTicketDto,
    );
    return this.borrowTicketRepository.save(borrowTicket);
  }

  async findByDeviceId(deviceId: string) {
    return this.borrowTicketRepository.find({
      where: { device: { id: deviceId } },
      relations: ['device', 'room', 'user'],
    });
  }
  async returnDevice(id: string) {
    const borrowTicket = await this.borrowTicketRepository.findOneBy({ id });
    if (borrowTicket) {
      borrowTicket.returned_at = new Date();
      borrowTicket.status = BorrowTicketStatus.RETURNED;
      return this.borrowTicketRepository.save(borrowTicket);
    }
    return null;
  }

  async findAll() {
    return this.borrowTicketRepository.find({
      relations: ['device', 'room', 'user'],
    });
  }

  async findOne(id: string) {
    return this.borrowTicketRepository.findOne({
      where: { id },
      relations: ['device', 'room', 'user'],
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
