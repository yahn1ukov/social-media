import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { isObservable, lastValueFrom } from 'rxjs';

import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req: Request = ctx.switchToHttp().getRequest();

    const dto = plainToInstance(LoginDto, req.body);

    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length) {
      const errorMessages = errors.flatMap((error) => Object.values(error.constraints || {}));
      throw new BadRequestException(errorMessages);
    }

    req.body = { login: dto.login, password: dto.password };

    const result = super.canActivate(ctx);

    if (isObservable(result)) {
      return lastValueFrom(result);
    }

    return result;
  }
}
