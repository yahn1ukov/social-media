import { Global, Module } from '@nestjs/common';

import { MinioModule } from '@/minio/minio.module';
import { FilesService } from './files.service';

@Global()
@Module({
  imports: [MinioModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
