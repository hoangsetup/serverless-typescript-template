import {DynamoDB} from 'aws-sdk';

export class DynamoDBConnection {
  /**
   * Get Dynamodb object
   * @param {string} endpoint
   * @param {string} region
   * @param {string} apiVersion
   * @returns {DynamoDB}
   */
  public static getDynamoDB(
    endpoint?: string,
    region?: string,
    apiVersion?: string,
  ): DynamoDB {
    let option: DynamoDB.Types.ClientConfiguration = {};
    if (endpoint) {
      option.endpoint = endpoint;
    }
    option.apiVersion = apiVersion || 'latest';
    option.region = region || 'us-west-2';
    return new DynamoDB(option);
  }

  /**
   * Get Dynamodb document client object
   * @param {string} endpoint
   * @param {string} region
   * @param apiVersion
   * @returns {DynamoDB.DocumentClient}
   */
  public static getDocClient(
    endpoint?: string,
    region?: string,
    apiVersion?: string,
  ): DynamoDB.DocumentClient {
    let option: DynamoDB.Types.ClientConfiguration = {};
    if (endpoint) {
      option.endpoint = endpoint;
    }
    option.apiVersion = apiVersion || 'latest';
    option.region = region || 'us-west-2';
    return new DynamoDB.DocumentClient(option);
  }
}
