import { Module } from '@nestjs/common';

import { FilesRepository } from './files.repository';
import { FilesService } from './files.service';

@Module({
  providers: [FilesRepository, FilesService],
  exports: [FilesService],
})
export class FilesModule {}
