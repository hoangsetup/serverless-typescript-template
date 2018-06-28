import * as express from 'express';
import {ApiError} from '../models/api.error';
import {BaseApiController} from './base.api.controller';

export class BaseApiMiddleware {
  public static HTTP_ERROR_STATUS = 400;
  public responseError(res: express.Response, error: Error, status?: number): void {
    let errorOject: ApiError = {
      message: error.message,
      status: (error as any).status || status || BaseApiController.HTTP_ERROR_STATUS,
    };
    // TODO: config for dev env, get full error to client side
    errorOject.meta = {
      name: error.name,
      stack: error.stack,
    };
    res.status(status || BaseApiMiddleware.HTTP_ERROR_STATUS).send(errorOject);
  }

}
