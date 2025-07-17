import { FileTypeValidator, Injectable, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

@Injectable()
export class ParseAvatarPipe extends ParseFilePipe {
  constructor() {
    super({
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({ maxSize: 100 * 1024 }),
        new FileTypeValidator({ fileType: /^image\/(jpeg|png|jpg)$/i }),
      ],
    });
  }
}
