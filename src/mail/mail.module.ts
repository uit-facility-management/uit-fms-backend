import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, UserModule],

  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
