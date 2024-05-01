import { parseUserId } from '../auth/utils.mjs'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB());

export function getUserId(event) {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export async function todoExists(todoId, userId, tableName) {
  const input = {
    "Key": {
      "todoId": {
        "S": todoId
      },
      "userId": {
        "S": userId
      }
    },
    "TableName": tableName
  };

  const result = await dynamoDbDocument.get({
    TableName: tableName,
    Key: {
      id: todoId
    }
  })

  return !!result.Item
}