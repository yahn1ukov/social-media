import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from './app-config.service';

interface AppConfigProps {
  isGlobal?: boolean;
  cache?: boolean;
}

@Module({})
export class AppConfigModule {
  static forRoot(props?: AppConfigProps): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [
        ConfigModule.forRoot({
          cache: props?.cache ?? false,
        }),
      ],
      providers: [AppConfigService],
      exports: [AppConfigService],
      global: props?.isGlobal ?? false,
    };
  }
}
