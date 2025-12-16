import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BorrowTicketService } from './borrow_ticket.service';
import { CreateBorrowTicketDto } from './dto/create-borrow_ticket.dto';
import { UpdateBorrowTicketDto } from './dto/update-borrow_ticket.dto';

@Controller('borrow-ticket')
export class BorrowTicketController {
  constructor(private readonly borrowTicketService: BorrowTicketService) {}

  @Post()
  create(@Body() createBorrowTicketDto: CreateBorrowTicketDto) {
    return this.borrowTicketService.create(createBorrowTicketDto);
  }

  @Get()
  findAll() {
    return this.borrowTicketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowTicketService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBorrowTicketDto: UpdateBorrowTicketDto,
  ) {
    return this.borrowTicketService.update(id, updateBorrowTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowTicketService.remove(id);
  }
}
