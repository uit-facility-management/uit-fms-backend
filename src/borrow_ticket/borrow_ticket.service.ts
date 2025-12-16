import { Inject, Injectable } from '@nestjs/common';
import { CreateBorrowTicketDto } from './dto/create-borrow_ticket.dto';
import { UpdateBorrowTicketDto } from './dto/update-borrow_ticket.dto';
import { BorrowTicket } from './entities/borrow_ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BorrowTicketService {
  constructor(
    @InjectRepository(BorrowTicket)
    private readonly borrowTicketRepository: Repository<BorrowTicket>,
  ) {}
  create(createBorrowTicketDto: CreateBorrowTicketDto) {
    const borrowTicket = this.borrowTicketRepository.create(
      createBorrowTicketDto,
    );
    return this.borrowTicketRepository.save(borrowTicket);
  }

  findAll() {
    return this.borrowTicketRepository.find({relations: ['device', 'room', 'user']});
  }

  findOne(id: string) {
    return this.borrowTicketRepository.findOne({
      where: { id },
      relations: ['device', 'room', 'user'],
    });
  }

  update(id: string, updateBorrowTicketDto: UpdateBorrowTicketDto) {
    const updatedBorrowTicket = this.borrowTicketRepository.save({
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
