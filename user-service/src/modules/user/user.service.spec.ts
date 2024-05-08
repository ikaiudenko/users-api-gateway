import { ConflictException } from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { UserService } from './user.service';
import { UserCreateDto } from '../../../../@common/src';
import { User } from './user.entity';
import { UserNotificationService } from './user.notification.service';
import { ObjectId } from 'mongodb';

describe(UserService, () => {
  let userService: UserService;
  let userRepository: jest.Mocked<MongoRepository<User>>;
  let userNotificationService: UserNotificationService;
  const userCreateDto: UserCreateDto = new UserCreateDto({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: null,
  });

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    userNotificationService = {
      sendWelcomeEmail: jest.fn(),
    } as any;

    userService = new UserService(userRepository, userNotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(UserService.prototype.create, () => {
    it('should create a new user', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);
      userRepository.save.mockResolvedValueOnce({
        _id: '123' as unknown as ObjectId,
        ...userCreateDto,
      });

      const result = await userService.create(userCreateDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('123');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: {
          email: userCreateDto.email,
        },
      });
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
      expect(userNotificationService.sendWelcomeEmail).toHaveBeenCalledWith(
        userCreateDto.email,
        userCreateDto.firstName,
        userCreateDto.lastName,
      );
    });

    it('should throw ConflictException if user already exists', async () => {
      const userCreateDto: UserCreateDto = new UserCreateDto({
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
      });

      userRepository.findOne.mockResolvedValueOnce({
        _id: '123' as unknown as ObjectId,
        ...userCreateDto,
      });

      await expect(userService.create(userCreateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe(UserService.prototype.getByEmail, () => {
    it('should return user by email', async () => {
      const entity = {
        _id: '123' as unknown as ObjectId,
        ...userCreateDto,
      };
      userRepository.findOne.mockResolvedValueOnce(entity);

      const result = await userService.getByEmail(entity.email);

      expect(result).toEqual(entity);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: entity.email },
      });
    });
  });
});
