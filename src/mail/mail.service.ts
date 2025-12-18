import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    pool: true,
    maxConnections: 1,
    family: 4, 

    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
  } as any);

  private buildMailTemplate(
    title: string,
    color: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
        <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 10px; padding: 25px; border: 1px solid #eee;">
          
          <h2 style="color: ${color}; margin-bottom: 10px;">${title}</h2>

          <p style="font-size: 15px; color: #333;">
            <strong>Room:</strong> ${roomName}<br>
            <strong>Time:</strong> ${start} → ${end}
          </p>

          <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px;">
            <p style="font-size: 14px; margin: 0; color: #666;">
              This is an automated notification from the UIT Facility Management System.
            </p>
          </div>

          <p style="text-align: center; margin-top: 25px; font-size: 12px; color: #999;">
            UIT Facility Management System<br>
            © ${new Date().getFullYear()} All rights reserved.
          </p>

        </div>
      </div>
    `;
  }

  async onModuleInit() {
    // Verify kết nối ngay khi khởi động để đảm bảo config đúng
    try {
      await this.transporter.verify();
      console.log('✓ Mail service ready (Pooled connection)');
    } catch (error) {
      console.error('✗ Mail service config error:', error.message);
    }
  }

  private async sendMailAsync(to: string, subject: string, html: string) {
    try {
      // Dùng await ở đây để bắt lỗi chính xác, nhưng hàm cha sẽ gọi mà không await
      await this.transporter.sendMail({
        from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
        to: to,
        subject: subject,
        html: html,
      });
      console.log('✓ Email sent:', to);
    } catch (error: any) {
      console.error('✗ Email failed:', {
        to,
        code: error.code,
        command: error.command,
        message: error.message,
      });
    }
  }

  // Helper để lấy email và gửi
  private async processMailLogic(
    to: string,
    subject: string,
    title: string,
    color: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    try {
      const user = await this.userService.findOne(to);
      const toEmail = user?.email || to;

      // Gọi gửi mail
      await this.sendMailAsync(
        toEmail,
        subject,
        this.buildMailTemplate(title, color, roomName, start, end),
      );
    } catch (err) {
      console.error('Error in processMailLogic:', err);
    }
  }

  sendScheduleApprovedMail(
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    // Gọi hàm async nhưng KHÔNG await để code chạy non-blocking (Fire & Forget an toàn)
    this.processMailLogic(
      to,
      'Room Booking Approved',
      'Room Booking Approved',
      '#28a745',
      roomName,
      start,
      end,
    );
  }

  sendScheduleCancelledMail(
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    this.processMailLogic(
      to,
      'Room Booking Cancelled',
      'Room Booking Cancelled',
      '#dc3545',
      roomName,
      start,
      end,
    );
  }

  sendScheduledMail(
    result: string,
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    if (result === 'approved') {
      this.sendScheduleApprovedMail(to, roomName, start, end);
    } else if (result === 'rejected') {
      this.sendScheduleCancelledMail(to, roomName, start, end);
    }
  }
}
