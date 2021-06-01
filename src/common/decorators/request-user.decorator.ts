import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const req: Request = ctx.switchToHttp().getRequest();

    return req.jwt?.userId;
  }
);