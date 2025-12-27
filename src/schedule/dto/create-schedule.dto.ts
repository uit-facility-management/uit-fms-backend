import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek, ScheduleStatus } from '../entities/schedule.entity';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Unique identifier for the room associated with the schedule',
  })
  @IsString()
  room_id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Unique identifier for the user who created the schedule',
  })
  @IsString()
  created_by: string;

  @ApiProperty({
    example: 2,
    description: 'Day of the week for the schedule (1=Monday, 7=Sunday)',
  })
  @IsEnum(DayOfWeek)
  day_of_week: DayOfWeek;
  @ApiProperty({
    example: '2024-07-01T10:00:00Z',
    description: 'Start time of the schedule',
  })
  @IsDate()
  start_time: Date;

  @ApiProperty({
    example: '2024-07-01T12:00:00Z',
    description: 'End time of the schedule',
  })
  @IsDate()
  end_time: Date;

  @ApiProperty({
    example: 1,
    description: 'Period start indicator',
  })
  @IsNumber()
  period_start: number;

  @ApiProperty({
    example: 1,
    description: 'Period end indicator',
  })
  @IsNumber()
  period_end: number;

  @ApiProperty({
    example: 'pending',
    description: 'Status of the schedule',
  })
  @IsEnum(ScheduleStatus)
  status: ScheduleStatus;
}
