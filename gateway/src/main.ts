import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

async function bootstrap() {
  const logger = new Logger('API_Gateway');
  const app = await NestFactory.create(AppModule, { logger });
  const config = new DocumentBuilder()
    .setTitle('Api docs')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.useGlobalInterceptors(new LoggerInterceptor(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  app.use(helmet());

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
