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
    const databaseUrl = process.env.DATABASE_URL;
    const envDbSslFlag = process.env.DB_SSL === 'true';
    const isProd = process.env.NODE_ENV === 'production';
    const urlRequestsSsl = !!databaseUrl && databaseUrl.includes('ssl=true');
    const useSsl = envDbSslFlag || (isProd && urlRequestsSsl);
 urlRequestsSsl;

    const dbConfig: any = {
      connectionString: databaseUrl,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
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