import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { MailController } from './mail.controller';
import { UserModule } from 'src/user/user.module';
import { RedisOptions } from 'ioredis';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL,
        tls: {},
      } as RedisOptions,
    }),

    BullModule.registerQueue({
      name: 'mail_queue',
    }),

    UserModule,
  ],
  controllers: [MailController],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
