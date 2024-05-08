import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: [`.env`], isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    UserModule,
  ],
})
export class AppModule {}
