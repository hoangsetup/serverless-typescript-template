import 'reflect-metadata';
import 'mocha';
import {expect} from 'chai';

import {DynamodbClient} from '../../../../src/utils/dynamodb/dynamodbClient';
import {MovieRepo} from '../../../../src/database/implementations/dynamodb/movie.repo';
import {deepEqual, instance, mock, reset, verify, when} from 'ts-mockito';

describe('Movie repo', () => {
  let repo: MovieRepo;
  let dynamodbClient: DynamodbClient;
  let mockedDynamodbClient = mock(DynamodbClient);
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
  let tableName = 'Movies';

  let getItemParams = {
    TableName: tableName,
    Key: movieId,
  };
  let insertItemNewParams = {
    TableName: tableName,
    Item: movie,
  };
  let insertItemExistedParams = {
    TableName: tableName,
    Item: {
      ...movieId,
      info : {
        directors : [
          'Alice Smith xxxxxx',
          'Bob Jones xxxxx',
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
    },
  };
  let removeItemParams = {
    TableName: tableName,
    Key: movieId,
  };
  let queryByYearParams = {
    TableName: tableName,
    KeyConditionExpression: `#yr = :yyyy`,
    ExpressionAttributeNames: {
      '#yr': 'year',
    },
    ExpressionAttributeValues: {
      ':yyyy': movie.year,
    },
  };
  let updateInfoData = {
    info: {
      plot: 'Everything happens all at once.',
      rating: 5.5,
      actors: ['Larry', 'Moe', 'Curly'],
    },
  };
  let queryUpdateParams = {
    TableName: tableName,
    Key: movieId,
    UpdateExpression: 'set info.rating = :r, info.plot = :p, info.actors = :a',
    ExpressionAttributeValues: {
      ':r': updateInfoData.info.rating,
      ':p': updateInfoData.info.plot,
      ':a': updateInfoData.info.actors,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  before(() => {
    when(mockedDynamodbClient.getItem(deepEqual(getItemParams))).thenResolve({Item: movie});
    when(mockedDynamodbClient.insertItem(deepEqual(insertItemNewParams))).thenResolve({});
    when(mockedDynamodbClient.insertItem(deepEqual(insertItemExistedParams)))
      .thenResolve({Attributes: insertItemExistedParams.Item});
    when(mockedDynamodbClient.deleteItem(deepEqual(removeItemParams))).thenResolve({Attributes: movie});
    when(mockedDynamodbClient.queryItems(deepEqual(queryByYearParams))).thenResolve({Items: [movie], Count: 1});
    when(mockedDynamodbClient.updateItem(deepEqual(queryUpdateParams)))
      .thenResolve({Attributes: {...movie, ...updateInfoData}});

    dynamodbClient = instance(mockedDynamodbClient);
    repo = new MovieRepo(dynamodbClient);
  });
  after(() => {
    reset(mockedDynamodbClient);
  });

  it('should get back movie by id', async () => {
    let result = await repo.getById(movieId);
    expect(result).to.deep.equal(movie);
    verify(mockedDynamodbClient.getItem(deepEqual(getItemParams))).once();
  });

  it('should insert and get back new item attributes', async () => {
    let result = await repo.insert(movie);
    expect(result).to.deep.equal(movie);
    verify(mockedDynamodbClient.insertItem(deepEqual(insertItemNewParams))).called();
  });

  it('should insert and get back existed item attributes', async () => {
    let result = await repo.insert(insertItemExistedParams.Item);
    expect(result).to.deep.equal(insertItemExistedParams.Item);
    verify(mockedDynamodbClient.insertItem(deepEqual(insertItemExistedParams))).called();
  });

  it('should remove movie by id', async () => {
    let result = await repo.remove(movieId);
    expect(result).to.deep.equal(movieId);
    verify(mockedDynamodbClient.deleteItem(deepEqual(removeItemParams))).called();
  });

  it('should get all movies by year', async () => {
    let result = await repo.getMoviesByYear(movie.year);
    expect(result).to.deep.equal([movie]);
    verify(mockedDynamodbClient.queryItems(deepEqual(queryByYearParams))).called();
  });

  it('should update movie by id', async () => {
    let result = await repo.update(movieId, {
      UpdateExpression: queryUpdateParams.UpdateExpression,
      ExpressionAttributeValues: queryUpdateParams.ExpressionAttributeValues,
    });
    expect(result).to.deep.equal({...movie, ...updateInfoData});
    verify(mockedDynamodbClient.updateItem(deepEqual(queryUpdateParams))).called();
  });
});
