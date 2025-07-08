import { Injectable, ParseUUIDPipe } from '@nestjs/common';

@Injectable()
export class ParseOptionalUUIDPipe extends ParseUUIDPipe {
  constructor() {
    super({ optional: true });
  }
}
