import { ApiProperty } from '@nestjs/swagger';
import { Device } from 'src/device/entities/device.entity';
import { Room } from 'src/room/entities/room.entity';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum BorrowTicketStatus {
  BORROWING = 'BORROWING',
  RETURNED = 'RETURNED',
}
@Entity()
export class BorrowTicket {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Unique identifier for the borrow ticket',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '22520671',
    description: 'Student number associated with the borrow ticket',
  })
  @Column({ type: 'varchar', length: 20 })
  student_code: string;

  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Identifier of the user who created the borrow ticket',
  })
  @Column({ type: 'uuid' })
  create_by: string;

  @ApiProperty({
    example: 'd4c3b2a1-6f5e-0987-dcba-654321fedcba',
    description: 'Identifier of the device being borrowed',
  })
  @Column({ type: 'uuid' })
  device_id: string;

  @ApiProperty({
    example: 'e5f6a1b2-7890-cdef-ab12-34567890abcd',
    description: 'Identifier of the room where the device is located',
  })
  @Column({ type: 'uuid' })
  room_id: string;

  @ApiProperty({
    example: '2023-10-01T10:00:00Z',
    description: 'Start time of the borrowing period',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrowed_at: Date;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'End time of the borrowing period',
  })
  @Column({ type: 'timestamp', nullable: true })
  returned_at: Date | null;

  @ApiProperty({
    example: 'BORROWING',
    description: 'Current status of the borrow ticket',
    enum: BorrowTicketStatus,
  })
  @Column({
    type: 'enum',
    enum: BorrowTicketStatus,
    default: BorrowTicketStatus.BORROWING,
  })
  status: BorrowTicketStatus;

  @ApiProperty({
    example: '2023-09-30T08:00:00Z',
    description: 'Timestamp when the borrow ticket was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    example: '2023-09-30T09:00:00Z',
    description: 'Timestamp when the borrow ticket was last updated',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  is_overdue(): boolean {
    const now = new Date();
    return (
      this.status === BorrowTicketStatus.BORROWING &&
      now.getTime() > this.borrowed_at.getTime() + 24 * 60 * 60 * 1000
    ); // 24 hours in milliseconds
  }

  //relations

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'create_by' })
  user: User;

  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => Device, (device) => device.id)
  @JoinColumn({ name: 'device_id' })
  device: Device;

  @ManyToOne(() => Student, (student) => student.student_code)
  @JoinColumn({ name: 'student_code' })
  student: Student;
}
