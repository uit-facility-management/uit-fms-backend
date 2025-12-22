import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BORROWING = 'BORROWING',
}
@Entity()
export class Device {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Unique identifier for the device',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Projector X1200',
    description: 'Name of the device',
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    example: 'High-resolution projector for presentations',
    description: 'Description of the device',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    example: 'AVAILABLE',
    description: 'Current status of the device',
  })
  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.ACTIVE,
  })
  status: DeviceStatus;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Timestamp when the device was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Timestamp when the device was last updated',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
