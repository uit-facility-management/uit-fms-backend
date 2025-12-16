import { PartialType } from '@nestjs/swagger';
import { CreateBorrowTicketDto } from './create-borrow_ticket.dto';

export class UpdateBorrowTicketDto extends PartialType(CreateBorrowTicketDto) {}
