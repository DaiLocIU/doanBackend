import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator((cookieName: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as Request;
  return request.cookies[cookieName];
});
