import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { todoExists, getUserId } from '../utils.mjs';
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth');

const s3Client = new S3Client();
const bucketName = process.env.IMAGES_S3_BUCKET;
const tableName = process.env.TODOS_TABLE;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

export async function handler(event) {
  const todoId = event.pathParameters.todoId;
  let userId = getUserId(event);

  if (!todoExists(todoId, userId, tableName)) {
    logger.error("Failed to generate upload url ", {
      message: "TODO does not exist",
      todoId: todoId
    });
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

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const uploadUrl = await getUploadUrl(todoId);

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;

  await addAttachmentUrl(todoId, userId, attachmentUrl);

  logger.info("Upload url was generated successfully ", {
    url: uploadUrl,
    todoId: todoId
  });

  return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
}

async function getUploadUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  });

  return url;
}


async function addAttachmentUrl(todoId, userId, attachmentUrl) {
  const input = {
    "ExpressionAttributeNames": {
      "#AU": "attachmentUrl"
    },
    "ExpressionAttributeValues": {
      ":u": {
        "S": attachmentUrl
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
    "UpdateExpression": "SET #AU = :u"
  };

  await dynamoDbDocument.update(input);
}

