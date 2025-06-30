import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt.guard';

export const JwtAuth = () => UseGuards(JwtAuthGuard);
