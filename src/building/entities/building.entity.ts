import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Building {
  @ApiProperty({ example: 'b1', description: 'Unique identifier uuid for the building' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Building A', description: 'Name of the building' })
  @Column()
  name: string;

  @ApiProperty({ example: 'active', description: 'Status of the building' })
  @Column()
  status: string;
}
