import { Inject, Injectable } from '@nestjs/common';
import { Mail, MailtrapClient } from 'mailtrap';
import { ISendEmail } from '../../../../@common/src';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    @Inject('MAILTRAP_CLIENT') private client: MailtrapClient,
    private config: ConfigService,
  ) {}

  async sendEmail(data: ISendEmail): Promise<{ message: string }> {
    const res = await this.client.send(this.buildConfig(data));

    return {
      message: res.success ? 'Welcome email sent!' : 'Can not send email',
    };
  }

  private buildConfig(data: ISendEmail): Mail {
    const { to, subject, text, templateId, vars } = data;

    return {
      from: { email: this.config.get<string>('MAILTRAP_SENDER') },
      to: [{ email: to }],
      ...(subject && !templateId && { subject }),
      ...(templateId && { template_uuid: templateId }),
      ...(text && { text }),
      ...(vars && { template_variables: vars }),
    };
  }
}
