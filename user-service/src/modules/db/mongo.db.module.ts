import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'mongodb',
          host: config.get<string>('DB_HOST'),
          port: parseInt(config.get<string>('DB_PORT')),
          database: config.get<string>('DB_DATABASE'),
          logging: false,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class MongoDbModule {}
