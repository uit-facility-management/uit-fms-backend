// src/mail/mail.queue.service.ts (Trên Backend chính)
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
const { PgBoss } = require('pg-boss');

@Injectable()
export class MailQueueService implements OnModuleInit, OnModuleDestroy {
  private boss: any;
  private readonly logger = new Logger(MailQueueService.name);

  constructor() {
    const dbConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
    this.boss = new PgBoss(dbConfig);
  }

  async onModuleInit() {
    await this.boss.start();
    this.logger.log('Mail Producer Ready (Chỉ tạo job, không gửi mail)');
  }

  async addEmailJob(to: string, subject: string, html: string) {
    return await this.boss.send('mail_queue', { to, subject, html });
  }

  async onModuleDestroy() {
    await this.boss.stop();
  }
}
