import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId, todoExists  } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth');

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB());
const tableName = process.env.TODOS_TABLE;

export async function handler(event) {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  // TODO: Remove a TODO item by id
  if (!todoExists(todoId, userId, tableName)) {
    logger.error("Fail to delete TODO ", {
      message: `TODO does not exist`,
      todoId: todoId
    })
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
        "S": userId
      }
    },
    "TableName": tableName
  };

  await dynamoDbDocument.delete(input)

  logger.info("Deleted sucessfully ", {
    message: "TODO has been deleted successfully",
    todoId: todoId
  })

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
  }
}
