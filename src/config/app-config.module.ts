import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from './app-config.service';

@Module({})
export class AppConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [ConfigModule.forRoot({ cache: true })],
      providers: [AppConfigService],
      exports: [AppConfigService],
      global: true,
    };
  }
}
