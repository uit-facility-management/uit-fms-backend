import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the user',
  })
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @ApiProperty({ example: 'JohnDoe', description: 'Username of the user' })
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  fullName: string;
  @ApiProperty({
    example: 'hashedpassword123',
    description: 'Hashed password of the user',
  })
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @ApiProperty({
    example: 'admin',
    description: 'Role of the user (admin or user)',
  })
  @Column({ type: 'varchar', length: 20, default: 'admin' })
  role: 'admin' | 'teacher';

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Timestamp when the user was created',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @ApiProperty({
    example: '2023-01-02T00:00:00Z',
    description: 'Timestamp when the user was last updated',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
