import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import {
  UpdateScheduleDto,
  UpdateScheduleStatusDto,
} from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DayOfWeek, Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { stat } from 'fs';
@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}
  async create(createScheduleDto: CreateScheduleDto) {
    return await this.dataSource.transaction(async (manager) => {
      const {
        room_id,
        start_time,
        end_time,
        period_start,
        period_end,
        day_of_week,
      } = createScheduleDto;
      const conflict = await manager
        .createQueryBuilder('schedule', 's')
        .setLock('pessimistic_write')
        .where('s.room_id = :roomId', { roomId: room_id })
        .andWhere('s.start_time < :end', { end: end_time })
        .andWhere('s.end_time > :start', { start: start_time })
        .andWhere('s.period_start < :pEnd', { pEnd: period_end })
        .andWhere('s.period_end > :pStart', { pStart: period_start })
        .andWhere('day_of_week = :dayOfWeek', {
          dayOfWeek: day_of_week,
        })
        .getOne();
      if (conflict) {
        throw new ConflictException('Phòng đã có lịch trùng. Không tạo được.');
      }
      const schedule = manager.create(Schedule, createScheduleDto);
      return await manager.save(schedule);
    });
  }

  async updateStatus(id: string, status: UpdateScheduleStatusDto) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (schedule) {
      schedule.status = status.schedule_status;
      this.mailService.sendScheduledMail(
        status.schedule_status,
        schedule.createdBy.email,
        schedule.room_id,
        schedule.start_time.toString(),
        schedule.end_time.toString(),
      );
      return this.scheduleRepository.save(schedule);
    }
    return null;
  }
  findByUser(user_id: string) {
    const schedules = this.scheduleRepository.find({
      where: { createdBy: { id: user_id } },
      relations: ['room', 'createdBy'],
    });
    this.logger.log(`Found schedules for user ${user_id}`);
    return schedules;
  }
  async findByRoom(room_id: string) {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.room', 'room')
      .leftJoinAndSelect('schedule.createdBy', 'createdBy')
      .where('schedule.room_id = :roomId', { roomId: room_id })
      .orderBy(
        `CASE
        WHEN schedule.status = 'pending' THEN 0
        ELSE 1
      END`,
        'ASC',
      )
      .getMany();
    return schedules;
  }
  async findAll() {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.room', 'room')
      .leftJoinAndSelect('schedule.createdBy', 'createdBy')
      .orderBy(
        `CASE 
        WHEN schedule.status = 'pending' THEN 0
        ELSE 1
      END`,
        'ASC',
      )
      .getMany();
    return schedules;
  }

  async findOne(id: string) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['room', 'createdBy'],
    });
    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${id} not found`);
    }
    Object.assign(schedule, updateScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string) {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Schedule with id ${id} not found`);
    }
    await this.scheduleRepository.delete(id);
  }
}
