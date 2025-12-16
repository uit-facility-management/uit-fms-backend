import { Module } from '@nestjs/common';
import { BorrowTicketService } from './borrow_ticket.service';
import { BorrowTicketController } from './borrow_ticket.controller';
import { BorrowTicket } from './entities/borrow_ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowTicket])],
  controllers: [BorrowTicketController],
  providers: [BorrowTicketService],
})
export class BorrowTicketModule {}
