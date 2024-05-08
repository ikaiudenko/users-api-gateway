import { LoggerInterceptor } from './logger.interceptor';
import { ExecutionContext, Logger, CallHandler } from '@nestjs/common';
import { Request } from 'express';

describe(LoggerInterceptor, () => {
  let interceptor: LoggerInterceptor;
  let loggerSpy: jest.SpyInstance;
  let contextMock: ExecutionContext;
  let requestMock: Partial<Request>;
  let callHandlerMock: CallHandler;

  beforeEach(() => {
    loggerSpy = jest.spyOn(Logger.prototype, 'log');
    interceptor = new LoggerInterceptor(new Logger());

    requestMock = {
      method: 'GET',
      path: '/test',
      query: { key: 'value' },
    };

    callHandlerMock = {
      handle: jest.fn(),
    };

    contextMock = {
      switchToHttp: () => ({
        getRequest: () => requestMock,
      }),
      getClass: jest.fn().mockReturnValue({ name: 'TestClass' }),
      getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    } as unknown as ExecutionContext;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(LoggerInterceptor.prototype.intercept, () => {
    it('should log incoming request', () => {
      interceptor.intercept(contextMock, callHandlerMock);

      expect(loggerSpy).toHaveBeenCalledWith({
        message: 'Request received for TestClass.testMethod',
        metadata: {
          method: 'GET',
          path: '/test',
          query: { key: 'value' },
        },
      });
    });

    it('should call handle method of call handler', () => {
      interceptor.intercept(contextMock, callHandlerMock);

      expect(callHandlerMock.handle).toHaveBeenCalled();
    });
  });
});
