import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../utils.mjs'

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())

export async function handler(event) {
  // TODO: Get all TODO items for a current user

  let userId = getUserId(event);

  let input = input = {
    "ExpressionAttributeValues": {
      ":v1": {
        "S": userId
      }
    },
    "KeyConditionExpression": "userId = :v1",
    "TableName": tableName
  };

  let result = await dynamoDbDocument.query(input);

  if (result.Items)
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
  else 
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        message: "No TODO was found!"
      })
    }
}
