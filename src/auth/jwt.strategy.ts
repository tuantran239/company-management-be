import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import IConfig, { JWTConfig } from 'src/common/config/config.interface';

import 'dotenv/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtAuthPayload } from './auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<IConfig>,
    private userService: UserService,
  ) {

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<JWTConfig>('jwtConfig').secret ?? 'secret',
    });
  }

  async validate(payload: JwtAuthPayload) {
    const { userId } = payload;

    const user = await this.userService.retrieve({ where: { id: userId } });

    return user;
  }
}
