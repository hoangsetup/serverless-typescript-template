import {BaseHttpController} from 'inversify-express-utils';
import {ApiError} from '../models/api.error';

export type ApiResponse<T> = ApiError | T;

export class BaseApiController extends BaseHttpController {
  public static HTTP_SUCCESS_STATUS = 200;
  public static HTTP_ERROR_STATUS = 400;

  constructor() {
    super();
  }

  public header(field: string, value?: string): BaseApiController {
    if (this.isHttpRequest()) {
      this.httpContext.response.header(field, value);
    }
    return this;
  }

  public status(status?: number): BaseApiController {
    if (this.isHttpRequest()) {
      this.httpContext.response.status(status || BaseApiController.HTTP_SUCCESS_STATUS);
    }
    return this;
  }

  public getSatusCode(): number {
    if (this.isHttpRequest()) {
      return this.httpContext.response.statusCode;
    }
    return -1;
  }

  public getApiResponse<T>(data: T | Error, status?: number): ApiResponse<T> {

    if (data instanceof Error) {
      let errorOject: ApiError = {
        message: data.message,
        status: (data as any).status || status || BaseApiController.HTTP_ERROR_STATUS,
      };
      // TODO: config for dev env, get full error to client side
      errorOject.meta = {
        name: data.name,
        stack: data.stack,
      };
      if (this.isHttpRequest()) {
        this.httpContext.response.status(errorOject.status);
      }
      return errorOject;
    }
    if (this.isHttpRequest()) {
      this.httpContext.response.status(status || BaseApiController.HTTP_SUCCESS_STATUS);
    }
    return data || {} as T;
  }

  private isHttpRequest(): boolean {
    return !!this.httpContext;
  }
}
