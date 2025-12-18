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

  private isMailAvailable = false;

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
      await Promise.race([
        this.transporter.verify(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Verification timeout')), 5000),
        ),
      ]);
      this.isMailAvailable = true;
      console.log('✓ Mail service ready');
    } catch (error: any) {
      this.isMailAvailable = false;
      console.warn('⚠ Mail service unavailable:', error?.message);
      console.warn('Emails will be logged but not sent');
    }
  }

  /**
   * Send email asynchronously without blocking
   * Fire and forget - errors are logged but don't throw
   */
  private async sendMailAsync(mailOptions: any) {
    if (!this.isMailAvailable) {
      console.log('📧 [SKIPPED] Email not sent (service unavailable):', {
        to: mailOptions.to,
        subject: mailOptions.subject,
      });
      return;
    }

    // Fire and forget - không await
    setImmediate(async () => {
      try {
        await this.transporter.sendMail(mailOptions);
        console.log('✓ Email sent:', mailOptions.to);
      } catch (error: any) {
        console.error('✗ Email failed:', {
          to: mailOptions.to,
          error: error?.message,
        });
      }
    });
  }

  // Remove async - không cần await nữa
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
        return this.sendMailAsync({
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
      })
      .catch((err) => console.error('Error resolving user email:', err));
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
        return this.sendMailAsync({
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
      })
      .catch((err) => console.error('Error resolving user email:', err));
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
