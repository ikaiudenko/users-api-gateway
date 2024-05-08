import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IUser, MS_NAME, UserCreateDto } from '../../../../@common/src';
import { Readable } from 'stream';

describe(UserController, () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, { provide: MS_NAME, useValue: jest.fn() }],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(UserController.prototype.createUser, () => {
    it('should create a new user with avatar', async () => {
      const user: IUser = {
        id: '123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
      };
      const mockUserCreateDto = new UserCreateDto({
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
      });

      const mockFile: Express.Multer.File = {
        fieldname: 'fieldname',
        originalname: 'fieldname',
        encoding: 'utf8',
        mimetype: 'jpeg',
        size: 1000,
        stream: Readable.from(''),
        destination: 'dir',
        filename: 'filename',
        path: 'path',
        buffer: Buffer.from(''),
      };

      jest.spyOn(userService, 'createUser').mockResolvedValueOnce(user);

      const result = await controller.createUser(mockFile, mockUserCreateDto);

      expect(result).toEqual(user);
      expect(userService.createUser).toHaveBeenCalledWith(mockUserCreateDto);
    });
  });

  describe(UserController.prototype.getUser, () => {
    it('should return a user by id', async () => {
      const userId = '123123';
      const mockUser: IUser = {
        id: '123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
      };
      jest.spyOn(userService, 'getById').mockResolvedValueOnce(mockUser);

      const result = await controller.getUser(userId);

      expect(result).toEqual(mockUser);
      expect(userService.getById).toHaveBeenCalledWith(userId);
    });
  });
});
