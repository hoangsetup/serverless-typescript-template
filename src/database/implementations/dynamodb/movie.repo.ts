import {IMovie} from '../../models/movie';
import {inject, injectable} from 'inversify';
import {DynamodbClient} from '../../../utils/dynamodb/dynamodbClient';
import TYPES from '../../../constant/types';
import {CreateMovieDto} from '../../../modules/movies/dtos/create.movie.dto';
import {CreateTableInput} from 'aws-sdk/clients/dynamodb';
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {IMovieRepo} from '../../interfaces/i.movie.repo';

export type MovieId = {
  title: string,
  year: number,
};

@injectable()
export class MovieRepo implements IMovieRepo {
  protected SCHEMA: CreateTableInput = {
    TableName: 'Movies',
    KeySchema: [
      {AttributeName: 'year', KeyType: 'HASH'},  // Partition key
      {AttributeName: 'title', KeyType: 'RANGE'},  // Sort key
    ],
    AttributeDefinitions: [
      {AttributeName: 'year', AttributeType: 'N'},
      {AttributeName: 'title', AttributeType: 'S'},
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  constructor(
    @inject(TYPES.Database.DynamoDbClient) private readonly dbClient: DynamodbClient,
  ) {

  }

  public getSchema(): CreateTableInput {
    return this.SCHEMA;
  }

  public async createTable(): Promise<boolean> {
    try {
      await this.dbClient.createTable(this.getSchema());
      return true;
    } catch (e) {
      console.log(`Error when try to create table Movies`, e);
      return false;
    }
  }

  public async query(params: DocumentClient.QueryInput): Promise<IMovie[]> {
    let data = await this.dbClient.queryItems(params);
    if (!data.Items || (!data.Count || data.Count <= 0)) {
      return [];
    }
    return data.Items as IMovie[];
  }

  public async getById(id: MovieId): Promise<IMovie | null> {
    let params: DocumentClient.GetItemInput = {
      TableName: this.getSchema().TableName,
      Key: id,
    };
    let result = await this.dbClient.getItem(params);
    return result ? result.Item as IMovie : null;
  }

  public async insert(movie: CreateMovieDto): Promise<IMovie> {
    let params: DocumentClient.PutItemInput = {
      TableName: this.getSchema().TableName,
      Item: movie,
    };
    let data = await this.dbClient.insertItem(params);
    return data.Attributes ? data.Attributes as IMovie : params.Item as IMovie;
  }

  public async remove(id: MovieId, preventCondition?: {
    ConditionExpression: DocumentClient.ConditionExpression,
    ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap,
  }): Promise<MovieId> {
    let params: DocumentClient.DeleteItemInput = {
      TableName: this.getSchema().TableName,
      Key: id,
    };
    if (preventCondition) {
      Object.assign(params, preventCondition);
    }
    await this.dbClient.deleteItem(params);
    return id;
  }

  public async update(key: MovieId, obj: {
    UpdateExpression: DocumentClient.UpdateExpression,
    ExpressionAttributeValues?: DocumentClient.ExpressionAttributeValueMap,
    Condition?: {
      ConditionExpression: DocumentClient.ConditionExpression,
      ExpressionAttributeValues: DocumentClient.ExpressionAttributeValueMap,
    },
  }): Promise<IMovie | null> {
    let params: DocumentClient.UpdateItemInput = {
      TableName: this.getSchema().TableName,
      Key: key,
      UpdateExpression: obj.UpdateExpression,
      ExpressionAttributeValues: obj.ExpressionAttributeValues || {},
      ReturnValues: 'UPDATED_NEW',
    };
    if (obj.Condition) {
      params.ConditionExpression = obj.Condition.ConditionExpression;
      Object.assign(params.ExpressionAttributeValues, obj.Condition.ExpressionAttributeValues);
    }
    let data = await this.dbClient.updateItem(params);
    return data ? data.Attributes as IMovie : null;
  }

  public async getMoviesByYear(year: number): Promise<IMovie[]> {
    let query: DocumentClient.QueryInput = {
      TableName: this.getSchema().TableName,
      KeyConditionExpression: `#yr = :yyyy`,
      ExpressionAttributeNames: {
        '#yr': 'year',
      },
      ExpressionAttributeValues: {
        ':yyyy': year,
      },
    };
    return await this.query(query);
  }

}
