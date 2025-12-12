import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { MailController } from './mail.controller';
import { UserModule } from 'src/user/user.module';
import { RedisOptions } from 'ioredis';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        connection: {
          url: config.get<string>('REDIS_URL'),
          tls: {}, // dùng SSL cho Upstash
        } as RedisOptions,
      }),
    }),

    BullModule.registerQueue({
      name: 'mail_queue',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        backoff: {
          type: 'fixed',
          delay: 30000,
        },
      },
    }),

    UserModule,
  ],

  controllers: [MailController],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
