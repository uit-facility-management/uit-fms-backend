import { Injectable } from '@nestjs/common';
import { CreateBorrowTicketDto } from './dto/create-borrow_ticket.dto';
import { UpdateBorrowTicketDto } from './dto/update-borrow_ticket.dto';

@Injectable()
export class BorrowTicketService {
  create(createBorrowTicketDto: CreateBorrowTicketDto) {
    return 'This action adds a new borrowTicket';
  }

  findAll() {
    return `This action returns all borrowTicket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} borrowTicket`;
  }

  update(id: number, updateBorrowTicketDto: UpdateBorrowTicketDto) {
    return `This action updates a #${id} borrowTicket`;
  }

  remove(id: number) {
    return `This action removes a #${id} borrowTicket`;
  }
}
