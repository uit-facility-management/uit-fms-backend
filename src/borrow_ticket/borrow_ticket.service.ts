import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateBorrowTicketDto } from './dto/create-borrow_ticket.dto';
import { UpdateBorrowTicketDto } from './dto/update-borrow_ticket.dto';
import {
  BorrowTicket,
  BorrowTicketStatus,
} from './entities/borrow_ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DeviceService } from 'src/device/device.service';
import { BorrowTicketQueryDto } from './dto/search-borrow_ticket.dto';

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

  async findAll(query?: BorrowTicketQueryDto) {
    if (!query) {
      const tickets = await this.borrowTicketRepository.find({
        relations: ['device', 'room', 'user', 'student'],
      });
      return tickets;
    }
    const qb = this.borrowTicketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.student', 'student')
      .leftJoinAndSelect('ticket.device', 'device')
      .leftJoinAndSelect('ticket.room', 'room')
      .leftJoinAndSelect('ticket.user', 'user');

    if (query?.q?.trim()) {
      const keyword = `%${query.q.trim()}%`;

      qb.andWhere(
        new Brackets((sub) => {
          sub
            // ===== người mượn =====
            .where('student.name ILIKE :keyword', { keyword })
            .orWhere('student.student_code::text ILIKE :keyword', { keyword })

            // ===== thiết bị / phòng =====
            .orWhere('device.name ILIKE :keyword', { keyword })
            .orWhere('room.name ILIKE :keyword', { keyword })

            // ===== trạng thái / id =====
            .orWhere('ticket.status::text ILIKE :keyword', { keyword })
            .orWhere('ticket.id::text ILIKE :keyword', { keyword })

            // ===== ngày mượn / ngày trả =====
            // search dạng: 27/12/2025
            .orWhere(`to_char(ticket.borrowed_at, 'DD/MM/YYYY') ILIKE :keyword`, { keyword })
            .orWhere(`to_char(ticket.returned_at, 'DD/MM/YYYY') ILIKE :keyword`, { keyword })

            // search dạng: 22:41:27 23/12/2025 (giống UI)
            .orWhere(`to_char(ticket.borrowed_at, 'HH24:MI:SS DD/MM/YYYY') ILIKE :keyword`, { keyword })
            .orWhere(`to_char(ticket.returned_at, 'HH24:MI:SS DD/MM/YYYY') ILIKE :keyword`, { keyword });
        }),
      );
    }

    qb.orderBy('ticket.updated_at', 'DESC');

    return qb.getMany();
  }

  async borrowedCount() {
    const overdueTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const overdueBorrowed = await this.borrowTicketRepository
      .createQueryBuilder('borrow_ticket')
      .leftJoinAndSelect('borrow_ticket.device', 'device')
      .leftJoinAndSelect('borrow_ticket.student', 'student')
      .where('borrow_ticket.status = :status', {
        status: BorrowTicketStatus.BORROWING,
      })
      .andWhere('borrow_ticket.borrowed_at < :overdueTime', { overdueTime })
      .getMany();
    const currentlyBorrowed = await this.borrowTicketRepository.countBy({
      status: BorrowTicketStatus.BORROWING,
    });
    return {  currentlyBorrowed, overdueBorrowed };
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
