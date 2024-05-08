import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  MS_NAME,
  US_EVENTS,
  US_NAME,
  UserCreateDto,
} from '../../../../@common/src';
import { of } from 'rxjs';

describe(UserService, () => {
  let service: UserService;
  let clientProxyMock: jest.Mocked<Partial<ClientProxy>>;
  let msMock: jest.Mock;
  let user: UserCreateDto;

  beforeEach(async () => {
    clientProxyMock = {
      send: jest.fn(),
      emit: jest.fn(),
    };
    msMock = jest.fn();
    user = new UserCreateDto({
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatar: null,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: MS_NAME,
          useValue: msMock,
        },
        {
          provide: US_NAME,
          useValue: clientProxyMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(UserService.prototype.createUser, () => {
    it('should create user', async () => {
      const expectedResult = {
        ...user,
        id: '123123',
      };

      clientProxyMock.send.mockReturnValueOnce(of(expectedResult));

      const result = await service.createUser(user);

      expect(clientProxyMock.send).toHaveBeenCalledWith(
        { cmd: US_EVENTS.Create },
        user,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe(UserService.prototype.getById, () => {
    it('should get user by ID', async () => {
      const userId = '123123123';
      const expectedResult = {
        id: userId,
        ...user,
      };

      clientProxyMock.send.mockReturnValueOnce(of(expectedResult));

      const result = await service.getById(userId);

      expect(clientProxyMock.send).toHaveBeenCalledWith(
        { cmd: US_EVENTS.Get },
        userId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe(UserService.prototype.getAvatar, () => {
    it('should get user avatar by ID', async () => {
      const userId = '123123123';
      const expectedResult = { ...user, avatar: null };

      clientProxyMock.send.mockReturnValueOnce(of(expectedResult));

      const result = await service.getAvatar(userId);

      expect(clientProxyMock.send).toHaveBeenCalledWith(
        { cmd: US_EVENTS.GetAvatar },
        userId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe(UserService.prototype.deleteAvatar, () => {
    it('should delete user avatar by ID', () => {
      const userId = '123123';

      service.deleteAvatar(userId);

      expect(clientProxyMock.emit).toHaveBeenCalledWith(
        US_EVENTS.DeleteAvatar,
        userId,
      );
    });
  });
});
