import { forwardRef, Module } from '@nestjs/common';
import { BorrowTicketService } from './borrow_ticket.service';
import { BorrowTicketController } from './borrow_ticket.controller';
import { BorrowTicket } from './entities/borrow_ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceModule } from 'src/device/device.module';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowTicket]), forwardRef(() => DeviceModule)],
  controllers: [BorrowTicketController],
  providers: [BorrowTicketService],
  exports: [BorrowTicketService],
})
export class BorrowTicketModule {}
