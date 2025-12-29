import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
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

export class RoomQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Building id' })
  @IsOptional()
  @IsString()
  buildingId?: string;

  @ApiPropertyOptional({
    description: 'Room type',
    enum: ['classroom', 'lab', 'meeting', 'other'],
  })
  @IsOptional()
  @IsIn(['classroom', 'lab', 'meeting', 'other'])
  type?: string;

  @ApiPropertyOptional({
    description: 'Room status',
    enum: ['active', 'inactive', 'maintenance'],
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'maintenance'])
  status?: string;

  @ApiPropertyOptional({ description: 'Stage/Floor (>=0)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stage?: number;

  @ApiPropertyOptional({ description: 'Capacity (>=0)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacity?: number;

}