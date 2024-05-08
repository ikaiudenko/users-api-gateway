import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: 'MAILTRAP_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new MailtrapClient({
          token: config.get<string>('MAILTRAP_TOKEN'),
        });
      },
    },
    EmailService,
  ],
  controllers: [EmailController],
})
export class EmailModule {}
