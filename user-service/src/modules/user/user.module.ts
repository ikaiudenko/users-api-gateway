import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from './user.entity';
import { MS_NAME, MS_QUEUE } from '../../../../@common/src';
import { UserNotificationService } from './user.notification.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MS_NAME,
        useFactory: async (config: ConfigService) => {
          const amqpHost = config.get<string>('AMQP_HOST');
          const amqpPort = config.get<string>('AMQP_PORT');
          const amqpUser = config.get<string>('AMQP_USER');
          const amqpPass = config.get<string>('AMQP_PASS');

          return {
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${amqpUser}:${amqpPass}@${amqpHost}:${amqpPort}`],
              queue: MS_QUEUE,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, UserNotificationService],
  controllers: [UserController],
})
export class UserModule {}
