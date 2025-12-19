import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

// Import kiểu này an toàn nhất
const { PgBoss } = require('pg-boss');

@Injectable()
export class MailQueueService implements OnModuleInit, OnModuleDestroy {
  private boss: any;
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailQueueService.name);

  constructor() {
    // 1. Config Nodemailer
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 2. Config DB
    const dbConfig = this.getDbConfig();
    this.boss = new PgBoss(dbConfig);

    // Bắt lỗi ngầm định của pg-boss
    this.boss.on('error', (error) => this.logger.error('PgBoss Error:', error));
  }

  private getDbConfig() {
    if (process.env.DATABASE_URL) {
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10,
        deleteAfterDays: 7,
        archiveCompletedAfterSeconds: 3600,
      };
    }
    return {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS,
      database: process.env.DB_NAME || 'uit_fms',
      ssl: false,
      max: 10,
      deleteAfterDays: 7,
      archiveCompletedAfterSeconds: 3600,
    };
  }

  async onModuleInit() {
    try {
      await this.boss.start();
      this.logger.log('✅ PgBoss Queue started!');

      // Tạo queue nếu chưa có
      try {
        await this.boss.createQueue('send-email');
      } catch (e) {}

      // SỬA Ở ĐÂY: Nhận biến là 'request' (có thể là mảng hoặc object)
      await this.boss.work('send-email', async (request) => {
        // 1. QUAN TRỌNG: Lấy job thật ra khỏi mảng
        // Nếu nó là mảng [job], lấy phần tử đầu tiên. Nếu là job lẻ, giữ nguyên.
        const job = Array.isArray(request) ? request[0] : request;

        // 2. KIỂM TRA AN TOÀN
        if (!job || !job.data) {
          this.logger.warn(
            `⚠️ Job không hợp lệ hoặc không có dữ liệu. Bỏ qua.`,
          );
          return;
        }

        const { to, subject, html } = job.data;

        // 3. Kiểm tra email
        if (!to) {
          this.logger.warn(`⚠️ Job ${job.id} thiếu địa chỉ email (to).`);
          return;
        }

        this.logger.log(`📧 Đang gửi mail cho: ${to}`);

        try {
          await this.transporter.sendMail({
            from: `"${process.env.GMAIL_FROM_NAME || 'UIT Facility'}" <${process.env.GMAIL_FROM}>`,
            to,
            subject,
            html,
          });
          this.logger.log(`✓ Gửi thành công cho ${to}`);
        } catch (error) {
          this.logger.error(`✗ Gửi lỗi cho ${to}`, error);
          throw error;
        }
      });
    } catch (error) {
      this.logger.error('Error starting PgBoss:', error);
    }
  }

  async onModuleDestroy() {
    await this.boss.stop();
  }

  // --- PRODUCER (Người gửi việc) ---
  async addEmailJob(to: string, subject: string, html: string) {
    // Log xem lúc thêm vào có dữ liệu không?
    this.logger.log(`📥 Đang thêm Job: To=${to}, Subject=${subject}`);

    // Đảm bảo truyền Object
    return await this.boss.send('send-email', { to, subject, html });
  }
}
