import { FileTypeValidator, Injectable, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

@Injectable()
export class ParseMediaPipe extends ParseFilePipe {
  constructor() {
    super({
      fileIsRequired: false,
      validators: [
        new MaxFileSizeValidator({ maxSize: 25 * 1024 * 1024 }),
        new FileTypeValidator({
          fileType: /^(image\/(jpeg|png|jpg)|video\/(mp4|mov|quicktime))$/i,
        }),
      ],
    });
  }
}
