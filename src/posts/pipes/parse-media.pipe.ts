import {
  FileTypeValidator,
  Injectable,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

@Injectable()
export class ParseMediaPipe extends ParseFilePipe {
  constructor() {
    super({
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 25 }),
        new FileTypeValidator({ fileType: /(png|jpg|jpeg|mp4|mov)$/i }),
      ],
    });
  }
}
