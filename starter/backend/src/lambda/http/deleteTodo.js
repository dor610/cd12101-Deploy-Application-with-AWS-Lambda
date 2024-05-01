import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId, todoExists  } from '../utils.mjs'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB());

export async function handler(event) {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  // TODO: Remove a TODO item by id
  let exist = todoExists(todoId, userId, tableName);
  if (!exist) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'TODO does not exist'
      })
    }
  }

  const input = {
    "Key": {
      "todoId": {
        "S": todoId
      },
      "userId": {
        "S": ""
      }
    },
    "TableName": "tableName"
  };

  await dynamoDbDocument.delete(input)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
  }
}
