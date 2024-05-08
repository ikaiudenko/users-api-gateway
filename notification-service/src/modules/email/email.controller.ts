import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ISendEmail, MS_EVENTS } from '../../../../@common/src/index';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern(MS_EVENTS.SendEmail)
  sendEmail(@Payload() data: ISendEmail) {
    return this.emailService.sendEmail(data);
  }
}
