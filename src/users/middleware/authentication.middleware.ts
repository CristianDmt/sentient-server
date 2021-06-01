import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AUTHENTICATION_SCHEMA } from 'src/constants';
import { ConfigService } from '@nestjs/config';
import { TokenInterface } from '../interfaces/token.interface';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService
  ) { }
  
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const [schema, token] = req.headers.authorization.split(' ');

      if (schema && schema !== AUTHENTICATION_SCHEMA) {
        throw new UnauthorizedException(`Bad authorization schema`);
      }

      if (token) {
        try {
          req.jwt = jwt.verify(token, this.configService.get('auth.jwt.secret')) as TokenInterface;
        } catch (error) {
          throw new UnauthorizedException(`Authorization token expired`);
        }
      } else {
        throw new UnauthorizedException(`Missing authorization token`);
      }
    } else {
      throw new UnauthorizedException(`Missing authorization`);
    }

    next();
  }
}
