import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';

@Processor('mail_queue')
export class MailProcessor extends WorkerHost {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  async process(job: Job<any>) {
    if (job.name === 'send-approve-mail') {
      const { to, roomName, start, end } = job.data;
      console.log('Processing approve mail:', to);

      await this.transporter.sendMail({
        from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
        to,
        subject: 'Room Booking Approved',
        html: `
          <h2>Booking Approved</h2>
          <p>Room: ${roomName}</p>
          <p>Time: ${start} → ${end}</p>
        `,
      });
    }

    if (job.name === 'send-cancel-mail') {
      const { to, roomName, start, end } = job.data;
      console.log('Processing cancel mail:', to);

      await this.transporter.sendMail({
        from: process.env.GMAIL_FROM || process.env.GMAIL_USER,
        to,
        subject: 'Room Booking Cancelled',
        html: `
          <h2>Booking Cancelled</h2>
          <p>Room: ${roomName}</p>
          <p>Time: ${start} → ${end}</p>
        `,
      });
    }
  }
}
