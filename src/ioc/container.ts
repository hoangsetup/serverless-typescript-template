import {Container} from 'inversify';
import TYPES from '../constant/types';
import {MovieRepo} from '../database/implementations/dynamodb/movie.repo';
import {MoviesService} from '../modules/movies/movies.service';
import {DynamodbClient} from '../utils/dynamodb/dynamodbClient';

let container = new Container();

// Config
container.bind<string>('string')
  .toConstantValue(process.env.DYNAMODB_ENDPOINT || '')
  .whenTargetNamed(TYPES.Database.DynamoDbEndpoint);
container.bind<string>('string')
  .toConstantValue(process.env.AWS_REGION || '')
  .whenTargetNamed(TYPES.Aws.Region);

container.bind<DynamodbClient>(TYPES.Database.DynamoDbClient).to(DynamodbClient);

container.bind<MovieRepo>(TYPES.Repositories.Movie).to(MovieRepo);
container.bind<MoviesService>(TYPES.Services.Movie).to(MoviesService);

export {container};
