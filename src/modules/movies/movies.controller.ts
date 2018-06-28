import {
  controller, httpDelete, httpGet,
  httpPost,
  requestBody, requestParam,
} from 'inversify-express-utils';
import {inject} from 'inversify';
import TYPES from '../../constant/types';
import {ApiResponse, BaseApiController} from '../../core/base.api.controller';
import {MoviesService} from './movies.service';
import {CreateMovieDto} from './dtos/create.movie.dto';
import {IMovie} from '../../database/models/movie';
import {CreateMovieValidate} from './middlewares/movie.validate';
import {ApiSuccess} from '../../models/api.success';

@controller('/movies')
export class MoviesController extends BaseApiController {
  constructor(
    @inject(TYPES.Services.Movie) private moviesService: MoviesService,
  ) {
    super();
  }

  @httpPost(
    '/',
    new CreateMovieValidate().handlerFactory(),
  )
  public async createMovie(@requestBody() movie: CreateMovieDto): Promise<ApiResponse<IMovie>> {
    try {
      let newMovie = await this.moviesService.createMovie(movie);
      return this.getApiResponse<IMovie>(newMovie);
    } catch (e) {
      return this.getApiResponse(e);
    }
  }

  @httpGet(
    '/:year-:title',
    (req, res, next) => {
      if (req.params.year) {
        req.params.year = parseInt(req.params.year, 10);
      }
      next();
    },
  )
  public async getMovie(
    @requestParam('title') title: string,
    @requestParam('year') year: number,
  ): Promise<ApiResponse<IMovie>> {
    try {
      let movie = await this.moviesService.getMovieById(title, year);
      return this.getApiResponse<IMovie>(movie);
    } catch (e) {
      return this.getApiResponse(e);
    }
  }

  @httpDelete(
    '/:year-:title',
    (req, res, next) => {
      if (req.params.year) {
        req.params.year = parseInt(req.params.year, 10);
      }
      next();
    },
  )
  public async deleteMovie(
    @requestParam('title') title: string,
    @requestParam('year') year: number,
  ): Promise<ApiResponse<ApiSuccess>> {
    try {
      let result = await this.moviesService.deleteMovieById(title, year);
      return this.getApiResponse<ApiSuccess>({
        success: result,
      });
    } catch (e) {
      return this.getApiResponse(e);
    }
  }

  @httpGet(
    '/years/:year',
    (req, res, next) => {
      if (req.params.year) {
        req.params.year = parseInt(req.params.year, 10);
      }
      next();
    },
  )
  public async getMoviesByYear(@requestParam('year') year: number): Promise<ApiResponse<IMovie[]>> {
    try {
      let movies = await this.moviesService.getMoviesByYear(year);
      return this.getApiResponse<IMovie[]>(movies);
    } catch (e) {
      return this.getApiResponse(e);
    }
  }
}
