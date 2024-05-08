import { BadRequestException, CallHandler } from '@nestjs/common';
import * as fileTypeMime from 'file-type-mime';
import { CustomFilesInterceptor } from './file.interceptor';

describe(CustomFilesInterceptor, () => {
  let interceptor: CustomFilesInterceptor;
  let contextMock: any;
  let nextMock: CallHandler;

  beforeEach(() => {
    interceptor = new CustomFilesInterceptor();

    jest
      .spyOn(fileTypeMime, 'parse')
      .mockReturnValue({ ext: 'pdf', mime: 'application/pdf' });

    contextMock = {
      switchToHttp: () => ({
        getResponse: jest.fn(),
        getNext: jest.fn(),
        getRequest: jest.fn().mockReturnValue({
          file: {
            buffer: Buffer.from('dummy content'),
            size: interceptor.sizeLimit,
          },
        }),
      }),
    };
    nextMock = {
      handle: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(CustomFilesInterceptor.prototype.intercept, () => {
    it('should throw BadRequestException if file is missing', () => {
      contextMock.switchToHttp().getRequest = jest.fn().mockReturnValue({});

      expect(() => interceptor.intercept(contextMock, nextMock)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if file type is not allowed', () => {
      expect(() => interceptor.intercept(contextMock, nextMock)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if file size exceeds limit', () => {
      contextMock.switchToHttp().getRequest = jest.fn().mockReturnValue({
        file: {
          buffer: Buffer.from('dummy content'),
          size: interceptor.sizeLimit + 1000, // Exceeds 1 MB limit
        },
      });

      expect(() => interceptor.intercept(contextMock, nextMock)).toThrow(
        BadRequestException,
      );
    });

    it('should set file type and call next handler if file is valid', () => {
      jest
        .spyOn(fileTypeMime, 'parse')
        .mockReturnValue({ ext: 'jpg', mime: 'image/jpeg' });

      interceptor.intercept(contextMock, nextMock);

      expect(nextMock.handle).toHaveBeenCalled();
      expect(() => interceptor.intercept(contextMock, nextMock)).not.toThrow(
        BadRequestException,
      );
    });
  });
});
