import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Full name of the student',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 2022, description: 'Entry year of the student' })
  @IsNumber()
  entry_year: number;
}
export class BulkCreateStudentDto {
  @ApiProperty({ example: 2022, description: 'Entry year of the students' })
  @IsNumber()
  entry_year: number;

  @ApiProperty({
    example: ['Nguyen Van A', 'Tran Thi B', 'Le Van C'],
    description: 'List of student names to be created',
  })
  @IsString({ each: true })
  names: string[]; // danh sách tên sinh viên
}
