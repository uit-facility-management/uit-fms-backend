import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail_queue')
    private readonly mailQueue: Queue,
    private readonly userService: UserService,  
  ) {}

  async sendScheduleApprovedMail(to: string, roomName: string, start: string, end: string) {
    const user = await this.userService.findOne(to);
    const toEmail = user?.email || to;

    console.log('Queue job send-approve-mail:', toEmail);
    await this.mailQueue.add(
      'send-approve-mail',
      { to: toEmail, roomName, start, end },
      {
        attempts: 3,
        backoff: 3000,
        removeOnComplete: true,
      },
    );
  }

  async sendScheduleCancelledMail(to: string, roomName: string, start: string, end: string) {
    console.log('Queue job send-cancel-mail:', to);

    await this.mailQueue.add(
      'send-cancel-mail',
      { to, roomName, start, end },
      {
        attempts: 3,
        backoff: 3000,
        removeOnComplete: true,
      },
    );
  }
}
