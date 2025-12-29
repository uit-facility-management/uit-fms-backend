import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BorrowTicketService } from './borrow_ticket.service';
import { CreateBorrowTicketDto } from './dto/create-borrow_ticket.dto';
import { UpdateBorrowTicketDto } from './dto/update-borrow_ticket.dto';
import { ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { BorrowTicketQueryDto } from './dto/search-borrow_ticket.dto';

@Controller('api/v1/borrow-ticket')
export class BorrowTicketController {
  constructor(private readonly borrowTicketService: BorrowTicketService) {}

  @Post()
  @ApiProperty({ description: 'Create a new borrow ticket' })
  @ApiResponse({ status: 201, description: 'The borrow ticket has been created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createBorrowTicketDto: CreateBorrowTicketDto) {
    return this.borrowTicketService.create(createBorrowTicketDto);
  }

  @Get()
  @ApiQuery({ name: 'q', required: false })
  findAll(@Query() query: BorrowTicketQueryDto) {
    return this.borrowTicketService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowTicketService.findOne(id);
  }

  @Patch('return/:id')
  returnDevice(@Param('id') id: string) {
    return this.borrowTicketService.returnDevice(id);
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
