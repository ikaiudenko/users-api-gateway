import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();

    this.logger.log({
      message: `Request received for ${context.getClass().name}.${context.getHandler().name}`,
      metadata: {
        method: request.method,
        path: request.path,
        query: request.query,
      },
    });

    return next.handle();
  }
}
