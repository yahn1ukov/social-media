import { UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from '../guards/local.guard';

export const LocalAuth = () => UseGuards(LocalAuthGuard);
