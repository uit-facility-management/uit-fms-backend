import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { MailQueueService } from './mail.queue.service'; // Import Queue Service

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly userService: UserService,
    private readonly mailQueueService: MailQueueService, // Inject Queue vào đây
  ) {}

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

  // 2. Hàm xử lý trung gian: Tìm User -> Đẩy vào Queue
  private async processMailLogic(
    toEmail: string,
    subject: string,
    title: string,
    color: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    try {
      const htmlContent = this.buildMailTemplate(
        title,
        color,
        roomName,
        start,
        end,
      );

      await this.mailQueueService.addEmailJob(toEmail, subject, htmlContent);

      this.logger.log(`Đã thêm job gửi mail cho: ${toEmail} vào hàng đợi.`);
    } catch (err) {
      this.logger.error('Lỗi khi đẩy mail vào hàng đợi:', err);
    }
  }

  // 3. Các hàm Public (Controller gọi vào đây)
  async sendScheduleApprovedMail(
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
     this.logger.log('sendScheduleApprovedMail to: ' + to);
    await this.processMailLogic(
      to,
      'Room Booking Approved',
      'Room Booking Approved',
      '#28a745',
      roomName,
      start,
      end,
    );
  }

  async sendScheduleCancelledMail(
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
    await this.processMailLogic(
      to,
      'Room Booking Cancelled',
      'Room Booking Cancelled',
      '#dc3545',
      roomName,
      start,
      end,
    );
  }

  async sendScheduledMail(
    result: string,
    to: string,
    roomName: string,
    start: string,
    end: string,
  ) {
     this.logger.log('sendScheduledMail to: ' + to + ' result: ' + result);
    if (result === 'approved') {
      await this.sendScheduleApprovedMail(to, roomName, start, end);
    } else if (result === 'rejected') {
      await this.sendScheduleCancelledMail(to, roomName, start, end);
    }
  }
}
