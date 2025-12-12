import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail_queue')
    private readonly mailQueue: Queue,
  ) {}

  async sendScheduleApprovedMail(to: string, roomName: string, start: string, end: string) {
    console.log('Queue job send-approve-mail:', to);

    await this.mailQueue.add(
      'send-approve-mail',
      { to, roomName, start, end },
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
