import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongoDbModule } from './modules/db/mongo.db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      isGlobal: true,
    }),
    MongoDbModule,
    UserModule,
  ],
})
export class AppModule {}
