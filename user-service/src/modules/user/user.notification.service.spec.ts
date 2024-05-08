import { UserNotificationService } from './user.notification.service';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { MS_EVENTS, WELCOME_EMAIL_SUBJECT } from '../../../../@common/src';

describe(UserNotificationService, () => {
  let userNotificationService: UserNotificationService;
  let emailService: ClientProxy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    emailService = {
      emit: jest.fn(),
    } as any;

    configService = {
      get: jest.fn(),
    } as any;

    userNotificationService = new UserNotificationService(
      emailService,
      configService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(UserNotificationService.prototype.sendWelcomeEmail, () => {
    it('should send welcome email', () => {
      const email = 'test@example.com';
      const firstName = 'John';
      const lastName = 'Doe';

      configService.get.mockReturnValueOnce('mockedTemplateId');

      userNotificationService.sendWelcomeEmail(email, firstName, lastName);

      expect(emailService.emit).toHaveBeenCalledWith(MS_EVENTS.SendEmail, {
        to: email,
        subject: WELCOME_EMAIL_SUBJECT,
        templateId: 'mockedTemplateId',
        vars: {
          user_name: `${firstName} ${lastName}`,
        },
      });
    });
  });
});
