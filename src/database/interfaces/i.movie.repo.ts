import {IMovie} from '../models/movie';
import {IBaseRepo} from './base.repo';

export interface IMovieRepo extends IBaseRepo<IMovie> {
  getMoviesByYear(year: number): Promise<IMovie[]>;
}
