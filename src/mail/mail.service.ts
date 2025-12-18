import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  private transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT) || 587,
    secure:
      process.env.MAIL_SECURE === 'true' ||
      (process.env.MAIL_PORT || '') === '465',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
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
    try {
      await this.transporter.verify();
      const host = process.env.MAIL_HOST || 'smtp.gmail.com';
      const port = Number(process.env.MAIL_PORT) || 587;
      const secure =
        process.env.MAIL_SECURE === 'true' ||
        (process.env.MAIL_PORT || '') === '465';
      console.log('Mail transporter verified', { host, port, secure });
    } catch (error: any) {
      console.error(
        'Mail transporter verification failed:',
        error?.message || error,
      );
    }
  }

  async sendScheduleApprovedMail(
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    const user = await this.userService.findOne(to);
    const toEmail = user?.email || to;
    console.log('Sending approve mail:', toEmail);
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
        to: toEmail,
        subject: 'Room Booking Approved',
        html: this.buildMailTemplate(
          'Room Booking Approved',
          '#28a745',
          roomName,
          start,
          end,
        ),
      });
    } catch (error: any) {
      console.error('Error sending approve mail:', error?.message || error);
      throw error;
    }
  }

  async sendScheduleCancelledMail(
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    console.log('Sending cancel mail:', to);
    const user = await this.userService.findOne(to);
    const toEmail = user?.email || to;
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
        to: toEmail,
        subject: 'Room Booking Cancelled',
        html: this.buildMailTemplate(
          'Room Booking Cancelled',
          '#dc3545',
          roomName,
          start,
          end,
        ),
      });
    } catch (error: any) {
      console.error('Error sending cancel mail:', error?.message || error);
      throw error;
    }
  }
  async sendScheduledMail(
    result: string,
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    if (result === 'approved') {
      return this.sendScheduleApprovedMail(to, roomName, start, end);
    } else if (result === 'rejected') {
      return this.sendScheduleCancelledMail(to, roomName, start, end);
    }
  }
}
