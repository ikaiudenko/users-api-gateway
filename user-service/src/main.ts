import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { US_QUEUE } from '../../@common/src';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger('UserService'),
  });

  const config = app.get(ConfigService);
  const amqpHost = config.get<string>('AMQP_HOST');
  const amqpPort = config.get<string>('AMQP_PORT');
  const amqpUser = config.get<string>('AMQP_USER');
  const amqpPass = config.get<string>('AMQP_PASS');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${amqpUser}:${amqpPass}@${amqpHost}:${amqpPort}`],
      queue: US_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
