import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';

import { UsersRepository } from '@/users/users.repository';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string) {
    const user = await this.usersRepository.findByUsernameOrEmail(login);
    if (!user) {
      throw new UnauthorizedException('Incorrect username or email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    return { id: user.id, username: user.username } as JwtPayload;
  }
}
