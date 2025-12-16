import { ApiProperty } from '@nestjs/swagger';
import { Building } from 'src/building/entities/building.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity()
export class Room {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the room',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Conference Room A',
    description: 'Name of the room',
  })
  @Column('varchar', { length: 100 })
  name: string;

  @ApiProperty({ example: 'active', description: 'Status of the room' })
  @Column('varchar', { length: 100 })
  status: string;

  @ApiProperty({
    example: 3,
    description: 'Floor number where the room is located',
  })
  @Column('int')
  stage: number;

  @ApiProperty({
    example: 'meeting',
    description: 'Type of the room',
  })
  @Column('varchar', { length: 100 })
  type: string;

  @ApiProperty({
    example: 10,
    description: 'Maximum capacity of the room',
  })
  @Column('int')
  capacity: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the building',
  })
  @Column('uuid',{select:false})
  building_id: string;

  //realationships

  @ManyToOne(() => Building, (building) => building.id)
  @JoinColumn({ name: 'building_id' })
  building: Building;
}
