import { Module } from '@nestjs/common';
import { EmailModule } from './modules/email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true,
    }),
    EmailModule,
  ],
})
export class AppModule {}
