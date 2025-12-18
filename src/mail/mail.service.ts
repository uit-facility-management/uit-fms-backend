import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import sgMail from '@sendgrid/mail';
@Injectable()
export class MailService {
  constructor(private readonly userService: UserService) {
    // Cấu hình API Key ngay khi Service khởi tạo
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  }

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

  private async sendMailAsync(to: string, subject: string, html: string) {
    const msg = {
      to: to,
      // Đảm bảo email này đã verify Single Sender trên SendGrid
      from: 'lamanhkhoa2004@gmail.com',
      subject: subject,
      html: html,
    };

    try {
      await sgMail.send(msg);
      console.log('✓ Email sent via SendGrid API:', to);
    } catch (error: any) {
      console.error('✗ Email failed:', error);
      // Log chi tiết lỗi từ SendGrid để dễ debug
      if (error.response) {
        console.error('SendGrid Error Body:', error.response.body);
      }
    }
  }

  // Helper xử lý logic tìm user
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
    // Fire-and-forget (Không await để trả response nhanh)
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
