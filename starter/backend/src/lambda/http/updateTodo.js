import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId, todoExists  } from '../utils.mjs'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

export async function handler(event) {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body);
  const userId = getUserId(event);
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
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
    "ExpressionAttributeNames": {
      "#DD": "dueDate",
      "#N": "Name",
      "#D": "done"
    },
    "ExpressionAttributeValues": {
      ":dd": {
        "S": updatedTodo.dueDate
      },
      ":n": {
        "S": updatedTodo.name
      },
      ":d": {
        "S": updatedTodo.done
      }
    },
    "Key": {
      "todoId": {
        "S": todoId
      },
      "userId": {
        "S": userId
      }
    },
    "ReturnValues": "ALL_NEW",
    "TableName": tableName,
    "UpdateExpression": "SET #DD = :dd, #N = :n, #D = :d"
  };

  const result = await dynamoDbDocument.update(input);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
  }
}
