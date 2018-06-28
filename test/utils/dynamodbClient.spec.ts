import 'reflect-metadata';
import 'mocha';
import {expect} from 'chai';

import * as uuid from 'uuid';
import * as faker from 'faker';

import {DynamodbClient} from '../../src/utils/dynamodb/dynamodbClient';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({path: path.resolve(process.cwd(), '.env')});

describe('Dynamodb client', () => {
  let awsConfig = {
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
    region: process.env.AWS_REGION || 'us-west-2',
  };
  let client: DynamodbClient;
  let tableSchema = {
    TableName: `Test-${uuid.v4()}`,
    KeySchema: [
      {AttributeName: 'id', KeyType: 'HASH'},  // Partition key
      {AttributeName: 'createdAt', KeyType: 'RANGE'},  // Sort key
    ],
    AttributeDefinitions: [
      {AttributeName: 'id', AttributeType: 'S'},
      {AttributeName: 'createdAt', AttributeType: 'N'},
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 5,
    },
  };
  let item = {
    id: uuid.v4(),
    createdAt: Date.now(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    name: faker.name.findName(),
    address: {
      address1: faker.fake('{{address.city}}, {{address.country}}'),
      address2: faker.fake('{{address.city}}, {{address.country}}'),
    },
    imageUrls: [faker.image.imageUrl(), faker.image.imageUrl(), faker.image.imageUrl()],
  };
  before(async () => {
    client = new DynamodbClient(awsConfig.endpoint, awsConfig.region);
    await client.createTable(tableSchema);
  });
  after(async () => {
    await client.deleteTable({TableName: tableSchema.TableName});
  });

  describe('Put', () => {
    it('should create new item', async () => {
      let params = {
        TableName: tableSchema.TableName,
        Item: item,
      };
      let result: any = await client.insertItem(params);
      expect(result.$response.httpResponse.statusCode).to.equal(200);
      expect(result.$response.httpResponse.statusMessage).to.equal('OK');
    });
  });

  describe('Get, Update, Delete', () => {
    before(async () => {
      let params = {
        TableName: tableSchema.TableName,
        Item: item,
      };
      await client.insertItem(params);
    });
    after(async () => {
      let params = {
        TableName: tableSchema.TableName,
        Key: {
          id: item.id,
          createdAt: item.createdAt,
        },
      };
      await client.deleteItem(params);
    });

    it('should get back item by id', async () => {
      let params = {
        TableName: tableSchema.TableName,
        Key: {
          id: item.id,
          createdAt: item.createdAt,
        },
      };
      let result = await client.getItem(params);
      expect(result.Item).to.deep.equal(item);
    });

    it('should update item by id ReturnValues: \'UPDATED_NEW\'', async () => {
      let address = {
        address1: faker.fake('{{address.city}}, {{address.country}}'),
        address2: faker.fake('{{address.city}}, {{address.country}}'),
      };
      let params = {
        TableName: tableSchema.TableName,
        Key: {
          id: item.id,
          createdAt: item.createdAt,
        },
        UpdateExpression: 'set address.address1 = :address1, address.address2 = :address2',
        ExpressionAttributeValues: {
          ':address1': address.address1,
          ':address2': address.address2,
        },
        ReturnValues: 'UPDATED_NEW',
      };
      let result = await client.updateItem(params);
      expect(result.Attributes).to.deep.equal({address});
    });

    it('should update item by id ReturnValues: \'ALL_NEW\'', async () => {
      let address = {
        address1: faker.fake('{{address.city}}, {{address.country}}'),
        address2: faker.fake('{{address.city}}, {{address.country}}'),
      };
      let params = {
        TableName: tableSchema.TableName,
        Key: {
          id: item.id,
          createdAt: item.createdAt,
        },
        UpdateExpression: 'set address.address1 = :address1, address.address2 = :address2',
        ExpressionAttributeValues: {
          ':address1': address.address1,
          ':address2': address.address2,
        },
      };
      let result = await client.updateItem(params);
      expect(result.Attributes).to.deep.equal({
        ...Object.assign({}, item),
        address,
      });
    });

    it('should delete item by id', async () => {
      let params = {
        TableName: tableSchema.TableName,
        Key: {
          id: item.id,
          createdAt: item.createdAt,
        },
      };
      await client.deleteItem(params);
      let result = await client.getItem(params);
      expect(result.Item).to.be.equal(undefined);
    });

  });

  describe('Query, Scan', () => {
    before(async () => {
      let params = {
        TableName: tableSchema.TableName,
        Item: item,
      };
      await client.insertItem(params);
    });
    after(async () => {
      let params = {
        TableName: tableSchema.TableName,
        Key: {
          id: item.id,
          createdAt: item.createdAt,
        },
      };
      await client.deleteItem(params);
    });

    it('should get back array of items by Query', async () => {
      let params = {
        TableName : tableSchema.TableName,
        KeyConditionExpression: '#id = :uuid',
        ExpressionAttributeNames: {
          '#id': 'id',
        },
        ExpressionAttributeValues: {
          ':uuid': item.id,
        },
      };
      let result = await client.queryItems(params);
      expect(result.Count).to.equal(1);
      expect(result.Items).to.deep.equal([item]);
    });

    it('should get back array of item by Scan', async () => {
      let params = {
        TableName : tableSchema.TableName,
      };
      let result = await client.scanItems(params);
      expect(result.Count).to.equal(1);
      expect(result.Items).to.deep.equal([item]);
    });

  });
});
