import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  BulkCreateStudentDto,
  CreateStudentDto,
} from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('bulk')
  @ApiProperty({ description: 'Bulk create students' })
  @ApiResponse({ status: 201, description: 'The students have been created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  bulkCreate(@Body() bulkCreateStudentDto: BulkCreateStudentDto) {
    return this.studentService.bulkCreate(bulkCreateStudentDto);
  }
  @Post()
  @ApiProperty({ description: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'The student has been created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get('code/:student_code')
  findByStudentCode(@Param('student_code') student_code: string) {
    return this.studentService.findByStudentCode(parseInt(student_code, 10));
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
