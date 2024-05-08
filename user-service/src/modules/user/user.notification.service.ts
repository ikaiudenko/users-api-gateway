import { Inject, Injectable } from '@nestjs/common';
import {
  ISendEmail,
  MS_EVENTS,
  MS_NAME,
  WELCOME_EMAIL_SUBJECT,
} from '../../../../@common/src';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserNotificationService {
  constructor(
    @Inject(MS_NAME) private emailService: ClientProxy,
    private config: ConfigService,
  ) {}

  sendWelcomeEmail(email: string, firstName: string, lastName: string) {
    this.emailService.emit<ISendEmail>(MS_EVENTS.SendEmail, {
      to: email,
      subject: WELCOME_EMAIL_SUBJECT,
      templateId: this.templateId,
      vars: {
        user_name: `${firstName} ${lastName}`,
      },
    });
  }

  get templateId(): string | undefined {
    return this.config.get('WELCOME_TPL_ID');
  }
}
