import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB());
const tableName = process.env.TODOS_TABLE;
const indexName = process.env.TODOS_CREATED_AT_INDEX;

export async function getSingleTodo(todoId, userId) {
    const input = {
        "Key": {
          "todoId": todoId,
          "userId": userId
        },
        "TableName": tableName
      };
    
      const result = await dynamoDbDocument.get(input);
    
      return result.Item;
  }

export async function getAllTodos(userId) {
  
  let input = {
    "ExpressionAttributeValues": {
      ":uid": userId
    },
    "KeyConditionExpression": "userId  = :uid",
    "TableName": tableName,
    "IndexName": indexName
  };

  let result = await dynamoDbDocument.query(input);
  return result;
}

export async function deleteSingleTodo(todoId, userId) {
    const input = {
        "Key": {
          "todoId": todoId,
          "userId": userId
        },
        "TableName": tableName
      };
    
    await dynamoDbDocument.delete(input);
    return;
}

export async function updateSingleTodo(todoId, userId, updateData) {
    const input = {
        "ExpressionAttributeNames": {
          "#DD": "dueDate",
          "#N": "Name",
          "#D": "done"
        },
        "ExpressionAttributeValues": {
          ":dd": updateData.dueDate,
          ":n": updateData.name,
          ":d": updateData.done
        },
        "Key": {
          "todoId": todoId,
          "userId": userId
        },
        "ReturnValues": "ALL_NEW",
        "TableName": tableName,
        "UpdateExpression": "SET #DD = :dd, #N = :n, #D = :d"
      };
    
      await dynamoDbDocument.update(input);
      return;
}

export async function createNewTodo(todoData) {  
    await dynamoDbDocument.put({
      TableName: tableName,
      Item: todoData
    });
}

export async function addAttachmentUrlToTodo(todoId, userId, attachmentUrl) {
    const input = {
      "ExpressionAttributeNames": {
        "#AU": "attachmentUrl"
      },
      "ExpressionAttributeValues": {
        ":u": attachmentUrl
      },
      "Key": {
        "todoId": todoId,
        "userId": userId
      },
      "ReturnValues": "ALL_NEW",
      "TableName": tableName,
      "UpdateExpression": "SET #AU = :u"
    };
  
    await dynamoDbDocument.update(input);
  }