import { forwardRef, Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './entities/device.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowTicketModule } from 'src/borrow_ticket/borrow_ticket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    forwardRef(() => BorrowTicketModule),
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
