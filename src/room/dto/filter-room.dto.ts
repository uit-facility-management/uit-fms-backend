import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber } from 'class-validator';
import { DayOfWeek } from 'src/schedule/entities/schedule.entity';

export class FilterRoomDto {
  @ApiProperty({
    required: false,
    example: '2024-07-01',
    description: 'Start time of the schedule',
  })
  @IsDate()
  start_time?: Date;
  @ApiProperty({
    required: false,
    example: '2024-07-01',
    description: 'End time of the schedule',
  })
  @IsDate()
  end_time?: Date;

  @ApiProperty({
    required: false,
    example: 1,
    description: 'Period start indicator',
  })
  @IsNumber()
  period_start?: number;

  @ApiProperty({
    required: false,
    example: 1,
    description: 'Period end indicator',
  })
  @IsNumber()
  period_end?: number;

  @ApiProperty({
    required: false,
    example: 2,
    description: 'Day of the week for the schedule (1=Monday, 7=Sunday)',
  })
  @IsEnum(DayOfWeek)
  day_of_week?: DayOfWeek;
}
