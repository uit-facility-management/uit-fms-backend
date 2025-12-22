import { Injectable } from '@nestjs/common';
import { BulkCreateStudentDto, CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentService {
  private readonly logger = new (require('@nestjs/common').Logger)(
    StudentService.name,
  );
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);
    if (student.entry_year < 2010) {
      throw new Error('Entry year must be 2010 or later');
    }
    const lastStudent = await this.studentRepository.findOne({
      where: { entry_year: createStudentDto.entry_year },
      order: { student_code: 'DESC' },
    });
    const yearPrefix = createStudentDto.entry_year.toString().slice(-2);
    this.logger.log(`Year prefix: ${yearPrefix}`);
    const base = `${yearPrefix}52`;

    let nextIndex = 1;
    if (lastStudent) {
      const lastIndex = parseInt(
        lastStudent.student_code.toString().slice(-4),
        10,
      );
      nextIndex = lastIndex + 1;
      this.logger.log('Next index:', nextIndex);
    }

    const studentCode = `${base}${nextIndex.toString().padStart(4, '0')}`;
    student.student_code = parseInt(studentCode, 10);
    return this.studentRepository.save(student);
  }

  async bulkCreate(dto: BulkCreateStudentDto) {
    const { entry_year, names } = dto;

    if (entry_year < 2010) {
      throw new Error('Entry year must be 2010 or later');
    }

    if (!names || names.length === 0) {
      throw new Error('Student name list must not be empty');
    }
    const lastStudent = await this.studentRepository.findOne({
      where: { entry_year },
      order: { student_code: 'DESC' },
    });

    const yearPrefix = entry_year.toString().slice(-2);
    const base = `${yearPrefix}52`;

    let startIndex = 1;
    if (lastStudent) {
      startIndex =
        parseInt(lastStudent.student_code.toString().slice(-4), 10) + 1;
    }

    this.logger.log(
      `Bulk create students: entry_year=${entry_year}, startIndex=${startIndex}`,
    );

    const students = names.map((full_name, i) => {
      const studentCode = `${base}${(startIndex + i)
        .toString()
        .padStart(4, '0')}`;

      return this.studentRepository.create({
        name: full_name,
        entry_year,
        student_code: parseInt(studentCode, 10),
      });
    });

    return this.studentRepository.save(students);
  }

  findByStudentCode(student_code: number) {
    return this.studentRepository.findOneBy({ student_code });
  }
  findAll() {
    return this.studentRepository.find();
  }

  findOne(id: string) {
    return this.studentRepository.findOneBy({ id });
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = this.studentRepository.findOneBy({ id });
    if (!student) {
      return `Student with id ${id} not found`;
    }
    return this.studentRepository.update(id, updateStudentDto);
  }

  remove(id: string) {
    const student = this.studentRepository.findOneBy({ id });
    if (!student) {
      return `Student with id ${id} not found`;
    }
    return this.studentRepository.delete(id);
  }
}
