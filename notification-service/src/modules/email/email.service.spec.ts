import { MailtrapClient, SendResponse } from 'mailtrap';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

describe(EmailService, () => {
  let emailService: EmailService;
  let mailtrapClient: jest.Mocked<Partial<MailtrapClient>>;
  let configService: jest.Mocked<Partial<ConfigService>>;

  beforeEach(() => {
    mailtrapClient = {
      send: jest.fn(),
    };

    configService = {
      get: jest.fn(),
    };

    emailService = new EmailService(
      mailtrapClient as unknown as MailtrapClient,
      configService as unknown as ConfigService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(EmailService.prototype.sendEmail, () => {
    it('should send email', async () => {
      const data = {
        to: 'test@example.com',
        subject: 'Test subject',
        text: 'Test message',
      };

      mailtrapClient.send.mockResolvedValueOnce({
        success: true,
        message_ids: [],
      });

      const result = await emailService.sendEmail(data);

      expect(result.message).toBe('Welcome email sent!');
      expect(mailtrapClient.send).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should handle failure to send email', async () => {
      const data = {
        to: 'test@example.com',
        subject: 'Test subject',
        text: 'Test message',
      };

      mailtrapClient.send.mockResolvedValueOnce({
        success: false,
        message_ids: [],
      } as unknown as SendResponse);

      const result = await emailService.sendEmail(data);

      expect(result.message).toBe('Can not send email');
      expect(mailtrapClient.send).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('buildConfig', () => {
    it('should build email configuration object', () => {
      const data = {
        to: 'test@example.com',
        subject: 'Test subject',
        text: 'Test message',
        vars: { key: 'value' },
      };

      configService.get.mockReturnValueOnce('sender@example.com');

      const config = emailService['buildConfig'](data);

      expect(config).toEqual({
        from: { email: 'sender@example.com' },
        to: [{ email: 'test@example.com' }],
        subject: 'Test subject',
        text: 'Test message',
        template_variables: { key: 'value' },
      });
    });
  });
});
