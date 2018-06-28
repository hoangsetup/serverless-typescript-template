import 'reflect-metadata';
import 'mocha';
import * as chai from 'chai';
chai.should();
import {expect} from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import {MoviesService} from '../../../src/modules/movies/movies.service';
import {MovieRepo} from '../../../src/database/implementations/dynamodb/movie.repo';
import {deepEqual, instance, mock, reset, when} from 'ts-mockito';

describe('Movies service', () => {
  let service: MoviesService;
  let movieRepo: MovieRepo;
  let mockedMovieRepo = mock(MovieRepo);

  let movieId = {
    year : 2013,
    title : 'Turn It Down, Or Else!',
  };
  let movie = {
    ...movieId,
    info : {
      directors : [
        'Alice Smith',
        'Bob Jones',
      ],
      release_date : '2013-01-18T00:00:00Z',
      rating : 6.2,
      genres : [
        'Comedy',
        'Drama',
      ],
      image_url : 'http://ia.media-imdb.com/images/N/O9ERWAU7FS797AJ7LU8HN09AMUP908RLlo5JF90EWR7LJKQ7@@._V1_SX400_.jpg',
      plot : 'A rock band plays their music at high volumes, annoying the neighbors.',
      rank : 11,
      running_time_secs : 5215,
      actors : [
        'David Matthewman',
        'Ann Thomas',
        'Jonathan G. Neff',
      ],
    },
  };

  let movieNotFoundId = {
    title: 'Notfound',
    year: 1994,
  };

  before(() => {
    when(mockedMovieRepo.insert(deepEqual(movie))).thenResolve(movie);
    when(mockedMovieRepo.getMoviesByYear(movie.year)).thenResolve([movie]);
    when(mockedMovieRepo.getById(deepEqual(movieId))).thenResolve(movie);
    when(mockedMovieRepo.getById(deepEqual(movieNotFoundId))).thenResolve(null);

    movieRepo = instance(mockedMovieRepo);
    service = new MoviesService(movieRepo);
  });
  after(() => {
    reset(mockedMovieRepo);
  });

  it('should create a movie', async () => {
    let result = await service.createMovie(movie);
    expect(result).to.deep.equal(movie);
  });

  it('should get back array of movies', async () => {
    let result = await service.getMoviesByYear(movie.year);
    expect(result).to.deep.equal([movie]);
  });

  it('should get back movie by movie\'s id', async () => {
    let result = await service.getMovieById(movieId.title, movieId.year);
    expect(result).to.deep.equal(movie);
  });

  it('should throw ModelNotFound exception', async () => {
    await expect(service.getMovieById(movieNotFoundId.title, movieNotFoundId.year)).to.be.rejectedWith('Movie not found!');
  });
});
