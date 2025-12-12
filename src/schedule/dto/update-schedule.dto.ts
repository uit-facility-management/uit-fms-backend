import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateScheduleDto } from './create-schedule.dto';
import { ScheduleStatus } from '../entities/schedule.entity';
import { IsEnum } from 'class-validator';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {}
export class UpdateScheduleStatusDto {
  @ApiProperty({
    example: 'approved',
    description: 'Status of the schedule',
  })
  @IsEnum(ScheduleStatus)
  schedule_status: ScheduleStatus;
}
