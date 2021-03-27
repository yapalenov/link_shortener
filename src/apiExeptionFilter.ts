import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { nanoid } from 'nanoid';

@Catch()
export class ApiExceptionsFilter extends BaseExceptionFilter {
  private readonly logger: Logger = new Logger(ApiExceptionsFilter.name);

  generateErrorId() {
    return Date.now().toString() + '-' + nanoid(4);
  }

  catch(exception: any, host: ArgumentsHost) {
    const isExpected = exception instanceof HttpException;

    const errorId = this.generateErrorId();

    const log = (message) =>
      isExpected ? this.logger.log(message) : this.logger.error(message);

    if (typeof exception.stack !== 'undefined') {
      log({ errorId, error: exception.message, stack: exception.stack });
    } else {
      log({ errorId, error: exception.message });
    }

    let error;

    if (isExpected) {
      error = exception;
      if (error.response && typeof error.response === 'object') {
        error.response.errorId = errorId;
      }
    } else {
      error = new InternalServerErrorException(
        `Internal Server Error #${errorId}`,
      );
    }

    return super.catch(error, host);
  }
}
