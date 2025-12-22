import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the the student',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 22520671, description: 'Student code number' })
  @Column({ type: 'int', unique: true })
  student_code: number;

  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Full name of the student',
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 2022, description: 'Entry year of the student' })
  @Column({ type: 'int' })
  entry_year: number;

  @ApiProperty({
    example: '2024-06-01T00:00:00Z',
    description: 'Date when the student record was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiProperty({
    example: '2024-06-01T00:00:00Z',
    description: 'Date when the student record was last updated',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  
}
