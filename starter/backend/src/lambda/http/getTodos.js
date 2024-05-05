import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth');

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB());
const tableName = process.env.TODOS_TABLE;
const indexName = process.env.TODOS_CREATED_AT_INDEX;

export async function handler(event) {
  // TODO: Get all TODO items for a current user

  let userId = getUserId(event);

  let input = {
    "ExpressionAttributeValues": {
      ":paritionKey": {
        "S": userId
      }
    },
    "KeyConditionExpression": "paritionKey  = :uid",
    "TableName": tableName,
    "IndexName": indexName
  };

  let result = await dynamoDbDocument.query(input);

  logger.info("Get TODOS ", result.Items.length);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(result.Items)
  }
}
