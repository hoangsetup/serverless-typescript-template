import {inject, injectable} from 'inversify';
import TYPES from '../../constant/types';
import {MovieRepo} from '../../database/implementations/dynamodb/movie.repo';
import {CreateMovieDto} from './dtos/create.movie.dto';
import {IMovie} from '../../database/models/movie';

@injectable()
export class MoviesService {
  constructor(
    @inject(TYPES.Repositories.Movie) private readonly movieRepo: MovieRepo,
  ) {}

  public async createMovie(movie: CreateMovieDto): Promise<IMovie> {
    return await this.movieRepo.insert(movie);
  }

  public async getMoviesByYear(year: number): Promise<IMovie[]> {
    return await this.movieRepo.getMoviesByYear(year);
  }

  public async getMovieById(title: string, year: number): Promise<IMovie> {
    let movie = await this.movieRepo.getById({title, year});
    if (!movie) {
      let error = new Error('Movie not found!');
      error.name = 'ModelNotFound';
      (error as any).status = 404;
      throw error;
    }
    return movie;
  }

  public async deleteMovieById(title: string, year: number): Promise<boolean> {
    let movieId = await this.movieRepo.remove({title, year});
    return !!movieId;
  }
}
