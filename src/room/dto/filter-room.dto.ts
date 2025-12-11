import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

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
}
