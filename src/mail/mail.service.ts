import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: 465, // Dùng port 465 như code queue cũ
    secure: true, // true cho port 465
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    // BỎ connectionTimeout và socketTimeout ngắn
    // Để mặc định 60s như code queue
  });

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
    // BỎ verify - để lazy connect như queue
    console.log('✓ Mail service initialized (lazy connection)');
  }

  private async sendMailAsync(to: string, subject: string, html: string) {
    // Fire and forget với try-catch
    setImmediate(async () => {
      try {
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
          error: error?.message,
        });
      }
    });
  }

  sendScheduleApprovedMail(
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    this.userService
      .findOne(to)
      .then((user) => {
        const toEmail = user?.email || to;
        return this.sendMailAsync(
          toEmail,
          'Room Booking Approved',
          this.buildMailTemplate(
            'Room Booking Approved',
            '#28a745',
            roomName,
            start,
            end,
          ),
        );
      })
      .catch((err) => console.error('Error resolving user:', err));
  }

  sendScheduleCancelledMail(
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    this.userService
      .findOne(to)
      .then((user) => {
        const toEmail = user?.email || to;
        return this.sendMailAsync(
          toEmail,
          'Room Booking Cancelled',
          this.buildMailTemplate(
            'Room Booking Cancelled',
            '#dc3545',
            roomName,
            start,
            end,
          ),
        );
      })
      .catch((err) => console.error('Error resolving user:', err));
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