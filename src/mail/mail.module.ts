import { Module } from '@nestjs/common';
import { MailQueueService } from './mail.queue.service';
import { MailService } from './mail.service'; 
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [],
  providers: [MailQueueService, MailService],
  exports: [MailQueueService,MailService], 
})
export class MailModule {}
