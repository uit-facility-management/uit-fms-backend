import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/room/entities/room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
export enum DayOfWeek {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}
export enum ScheduleStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  PENDING = 'pending',
}
@Entity()
export class Schedule {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the schedule',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Unique identifier for the room associated with the schedule',
  })
  @Column('uuid', { select: false })
  room_id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Unique identifier for the user who created the schedule',
  })
  @Column('uuid', { select: false })
  created_by: string;

  @ApiProperty({
    example: '2024-07-01T10:00:00Z',
    description: 'Start time of the schedule',
  })
  @Column('timestamptz')
  start_time: Date;

  @ApiProperty({
    example: '2024-07-01T12:00:00Z',
    description: 'End time of the schedule',
  })
  @Column('timestamptz')
  end_time: Date;

  @ApiProperty({
    example: 1,
    description: 'Period start indicator',
  })
  @Column('int')
  period_start: number;

  @ApiProperty({
    example: 1,
    description: 'Period end indicator',
  })
  @Column('int')
  period_end: number;

  @ApiProperty({
    example: 2,
    description: 'Day of the week for the schedule (1=Monday, 7=Sunday)',
  })
  @Column('int', { nullable: true })
  day_of_week: DayOfWeek;
  @ApiProperty({
    example: 'active',
    description: 'Status of the schedule',
  })
  @Column('varchar', { default: ScheduleStatus.PENDING })
  status: ScheduleStatus;

  //Relationships
  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
