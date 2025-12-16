import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '../entities/device.entity';
import { IsEnum, IsString } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    example: 'MicArophone 1',
    description: 'Name of the device',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'High-quality microphone for clear audio recording',
    description: 'Description of the device',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Current status of the device',
  })
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}
