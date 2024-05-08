import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MS_QUEUE } from '../../@common/src';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const amqpHost = config.get<string>('AMQP_HOST');
  const amqpPort = config.get<string>('AMQP_PORT');
  const amqpUser = config.get<string>('AMQP_USER');
  const amqpPass = config.get<string>('AMQP_PASS');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${amqpUser}:${amqpPass}@${amqpHost}:${amqpPort}`],
      queue: MS_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
