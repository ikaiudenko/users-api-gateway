import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { US_NAME, US_QUEUE } from '../../../../@common/src/index';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: US_NAME,
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => {
          const amqpHost = config.get<string>('AMQP_HOST');
          const amqpPort = config.get<string>('AMQP_PORT');
          const amqpUser = config.get<string>('AMQP_USER');
          const amqpPass = config.get<string>('AMQP_PASS');

          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${amqpUser}:${amqpPass}@${amqpHost}:${amqpPort}`],
              queue: US_QUEUE,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
