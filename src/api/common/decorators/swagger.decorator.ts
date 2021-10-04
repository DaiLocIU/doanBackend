import { applyDecorators, Controller } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiOperationOptions,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { ApiException } from '../api-exception.vm';

export const ApiErrors = () => applyDecorators(
  ApiNotFoundResponse({ type: ApiException, description: 'Not found' }),
  ApiBadRequestResponse({ type: ApiException, description: 'Bad Request' }),
  ApiInternalServerErrorResponse({
    type: ApiException,
    description: 'Internal Server Error',
  }),
);

export const ApiController = (prefix: string, tag: string): ClassDecorator => (target) => {
  Controller(prefix)(target);
  ApiTags(tag)(target);
  ApiErrors()(target);
};

export const ApiOperationId = (options?: ApiOperationOptions) => (
  target: any, propertyKey: string, descriptor: PropertyDescriptor,
) => {
  const controllerName = target.constructor.name;
  const operationId = `${controllerName.substr(0, controllerName.indexOf('Controller'))}_${propertyKey}`;

  ApiOperation({
    ...options,
    operationId,
  })(target, propertyKey, descriptor);
};

export const ApiFile = (fileName: string = 'file'): MethodDecorator => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        [fileName]: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })(target, propertyKey, descriptor);
};
