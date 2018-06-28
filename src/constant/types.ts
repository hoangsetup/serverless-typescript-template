const TYPES = {
  Services: {
    User: Symbol.for('UsersService'),
    Movie: Symbol.for('MoviesService'),
  },
  Database: {
    DynamoDbClient: Symbol.for('DynamodbClient'),
    DynamoDbEndpoint: Symbol.for('DynamoDbEndpoint'),
  },
  Aws: {
    Region: Symbol.for('Region'),
  },
  Repositories: {
    Movie: Symbol.for('MovieRepository'),
  },
};

export default TYPES;
