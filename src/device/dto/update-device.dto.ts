import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDeviceDto } from './create-device.dto';
import { DeviceStatus } from '../entities/device.entity';
import { IsEnum } from 'class-validator';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
  @ApiProperty({
    example: 'ACTIVE',
    description: 'Current status of the device',
  })
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;
}
