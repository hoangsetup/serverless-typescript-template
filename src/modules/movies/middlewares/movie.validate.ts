import {BaseApiMiddleware} from '../../../core/base.api.middleware';
import * as express from 'express';
import {CreateMovieDto} from '../dtos/create.movie.dto';
import {validate} from 'class-validator';

export class CreateMovieValidate extends BaseApiMiddleware {
  public handlerFactory(): express.RequestHandler {
    return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      let movie = new CreateMovieDto();
      Object.assign(movie, req.body);
      let errors = await validate(movie);
      if (errors.length > 0) {
        let message = '';
        for (let k of Object.keys(errors[0].constraints)) {
          message += `${errors[0].constraints[k]}, `;
        }
        message = message.slice(0, -2); // remove last ', `' characters
        let error = new Error(message);
        error.name = 'ValidationError';
        return this.responseError(res, error);
      }
      next();
    };
  }
}
