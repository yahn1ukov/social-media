import { UseGuards } from '@nestjs/common';

import { JwtRefreshAuthGuard } from '../guards/jwt-refresh.guard';

export const JwtRefreshAuth = () => UseGuards(JwtRefreshAuthGuard);
