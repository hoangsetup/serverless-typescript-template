import 'reflect-metadata';
import 'mocha';
import {expect} from 'chai';
import {MoviesService} from '../../../src/modules/movies/movies.service';
import {MoviesController} from '../../../src/modules/movies/movies.controller';
import {deepEqual, instance, mock, reset, verify, when} from 'ts-mockito';

describe('Movies controller', () => {
  let service: MoviesService;
  let mockedService = mock(MoviesService);
  let controller: MoviesController;

  let movieId = {
    year : 2013,
    title : 'Turn It Down, Or Else!',
  };
  before(() => {
    when(mockedService.createMovie(deepEqual(movieId))).thenResolve(movieId);
    when(mockedService.getMovieById(movieId.title, movieId.year)).thenResolve(movieId);
    when(mockedService.deleteMovieById(movieId.title, movieId.year)).thenResolve(true);
    when(mockedService.getMoviesByYear(movieId.year)).thenResolve([movieId]);

    service = instance(mockedService);
    controller = new MoviesController(service);
  });
  after(() => {
    reset(mockedService);
  });

  it('should create a movice', async () => {
    let result = await controller.createMovie(movieId);
    expect(result).to.be.deep.equal(movieId);
    verify(mockedService.createMovie(deepEqual(movieId))).called();
  });

  it('should get back movie', async () => {
    let result = await controller.getMovie(movieId.title, movieId.year);
    expect(result).to.deep.equal(movieId);
    verify(mockedService.getMovieById(movieId.title, movieId.year)).called();
  });

  it('should delete a movie', async () => {
    let result = await controller.deleteMovie(movieId.title, movieId.year);
    expect(result).to.deep.equal({success: true});
    verify(mockedService.deleteMovieById(movieId.title, movieId.year)).called();
  });

  it('should get back array of movie', async () => {
    let result = await controller.getMoviesByYear(movieId.year);
    expect(result).to.deep.equal([movieId]);
    verify(mockedService.getMoviesByYear(movieId.year)).called();
  });
});
