import { Module } from '@nestjs/common';
import { BorrowTicketService } from './borrow_ticket.service';
import { BorrowTicketController } from './borrow_ticket.controller';

@Module({
  controllers: [BorrowTicketController],
  providers: [BorrowTicketService],
})
export class BorrowTicketModule {}
