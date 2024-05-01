import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

export async function handler(event) {
  const newTodo = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item
  const itemId = uuidv4();

  const newItem = {
    todoId: itemId,
    userId: "",
    attachmentUrl: "",
    createdAt: new Date().toISOString(),
    ...newTodo,
    done: false
  }

  await dynamoDbDocument.put({
    TableName: tableName,
    Item: newItem
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}

