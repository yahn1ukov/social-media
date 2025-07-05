import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { MinioModule } from '@/minio/minio.module';
import { FilesService } from './files.service';

@Module({
  imports: [PrismaModule, MinioModule],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
