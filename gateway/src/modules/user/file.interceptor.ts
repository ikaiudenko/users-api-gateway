import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import * as fileTypeMime from 'file-type-mime';

@Injectable()
export class CustomFilesInterceptor {
  readonly sizeLimit: number = 1000000; // 1MB
  readonly mimetypes = ['image/jpeg', 'image/png'];

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const file: Express.Multer.File | undefined = request.file;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    const mimetype = this.getFileType(file.buffer);

    if (!this.mimetypes.includes(mimetype)) {
      throw new BadRequestException(`File type ${mimetype} is not allowed`);
    }

    this.validateSize(file);

    file['type'] = mimetype;

    return next.handle();
  }

  private getFileType(buffer: Buffer): string | undefined {
    const response = fileTypeMime.parse(buffer);

    return response?.mime;
  }

  private validateSize(file: Express.Multer.File): void {
    const limit = this.sizeLimit;

    if (file.size > limit) {
      const formattedSize = this.formatBytes(limit);
      throw new BadRequestException(
        `Maximum file size for file ${formattedSize}.`,
      );
    }
  }

  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
