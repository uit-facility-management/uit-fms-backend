  import { Module } from '@nestjs/common';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { UserModule } from './user/user.module';
  import { BuildingModule } from './building/building.module';
  import { RoomModule } from './room/room.module';
  import { RoomAssetsModule } from './room-assets/room-assets.module';
  import { AuthModule } from './auth/auth.module';
  import { ScheduleModule } from './schedule/schedule.module';
  import { IncidentModule } from './incident/incident.module';
  import { MailModule } from './mail/mail.module';
  import { BorrowTicketModule } from './borrow_ticket/borrow_ticket.module';
  import { DeviceModule } from './device/device.module';

  @Module({
    imports: [
      ConfigModule.forRoot({ isGlobal: true }), // đọc .env
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const databaseUrl = config.get<string>('DATABASE_URL');

          if (databaseUrl) {
            // MODE: DEPLOY (Railway)
            return {
              type: 'postgres',
              url: databaseUrl,
              autoLoadEntities: true,
              synchronize: true,
              ssl: {
                rejectUnauthorized: false,
              },
            };
          } else {
            const port = config.get<number>('PORT');

            return {
              type: 'postgres',
              host: config.get<string>('DB_HOST'),
              port: config.get<number>('DB_PORT'),
              username: config.get<string>('DB_USER'),
              password: config.get<string>('DB_PASS'),
              database: config.get<string>('DB_NAME'),
              autoLoadEntities: true,
              synchronize: true,
              ssl: {
                rejectUnauthorized: false,
              },
            };
          }
        },
      }),
      UserModule,
      BuildingModule,
      RoomModule,
      RoomAssetsModule,
      AuthModule,
      ScheduleModule,
      IncidentModule,
      MailModule,
      BorrowTicketModule,
      DeviceModule,
    ],
  })
  export class AppModule {}
