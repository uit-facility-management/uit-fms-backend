import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Get('test-mail')
  async testMail() {
    console.log('Emit schedule_approved');
    await this.mailService.sendScheduleApprovedMail(
      'khoadaubuu@gmail.com',
      'Room 101',
      '2025-12-11 08:00',
      '2025-12-11 10:00',
    );
    return 'Event emitted';
  }
}
