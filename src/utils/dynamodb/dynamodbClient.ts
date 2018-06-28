import {inject, injectable, named} from 'inversify';
import {DynamoDB} from 'aws-sdk';
import {DynamoDBConnection} from './dynamoDBConnection';
import {DocumentClient} from 'aws-sdk/lib/dynamodb/document_client';
import {CreateTableInput, CreateTableOutput} from 'aws-sdk/clients/dynamodb';
import TYPES from '../../constant/types';

@injectable()
export class DynamodbClient {
  protected dynamodb: DynamoDB;
  protected documentClient: DynamoDB.DocumentClient;
  protected endpoint: string;
  protected region: string;

  constructor(
    @inject('string') @named(TYPES.Database.DynamoDbEndpoint) endpoint: string,
    @inject('string') @named(TYPES.Aws.Region) region: string,
    ) {
    this.endpoint = endpoint;
    this.region = region;
    this.dynamodb = DynamoDBConnection.getDynamoDB(this.endpoint, this.region);
    this.documentClient = DynamoDBConnection.getDocClient(this.endpoint, this.region);
  }

  public getConfig(): {endpoint: string, region: string} {
    return {
      endpoint: this.endpoint,
      region: this.region,
    };
  }

  public createTable(params: CreateTableInput): Promise<CreateTableOutput> {
    return this.dynamodb.createTable(params).promise();
  }

  public insertItem(params: DocumentClient.PutItemInput): Promise<DocumentClient.PutItemOutput> {
    if (!params.ReturnValues) {
      params.ReturnValues = 'ALL_OLD';
    }
    return this.documentClient.put(params).promise();
  }

  public getItem(params: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput> {
    return this.documentClient.get(params).promise();
  }

  public updateItem(params: DocumentClient.UpdateItemInput): Promise<DocumentClient.UpdateItemOutput> {
    if (!params.ReturnValues) {
      params.ReturnValues = 'ALL_NEW';
    }
    return this.documentClient.update(params).promise();
  }

  public deleteItem(params: DocumentClient.DeleteItemInput): Promise<DocumentClient.DeleteItemOutput> {
    if (!params.ReturnValues) {
      params.ReturnValues = 'ALL_OLD';
    }
    return this.documentClient.delete(params).promise();
  }

  public queryItems(params: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput> {
    return this.documentClient.query(params).promise();
  }

  public scanItems(params: DocumentClient.ScanInput): Promise<DocumentClient.ScanOutput> {
    return this.documentClient.scan(params).promise();
  }

  public deleteTable(params: DynamoDB.DeleteTableInput): Promise<DynamoDB.DeleteTableOutput> {
    return this.dynamodb.deleteTable(params).promise();
  }
}
