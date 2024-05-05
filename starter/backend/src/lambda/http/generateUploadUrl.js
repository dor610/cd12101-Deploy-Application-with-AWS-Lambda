import { getUserId } from '../utils.mjs';
import { createLogger } from '../../utils/logger.mjs'
import { getUploadUrl } from '../../businessLogic/AttachmentSerivce.mjs';
import { todoExists, addAttachmentUrl } from '../../businessLogic/TodoService.mjs';
import { generateReponse } from '../../response/GenericResponse.mjs';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger('uploadUrl');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  ).handler(async (event) => {
  const todoId = event.pathParameters.todoId;
  let userId = getUserId(event);

  if (!todoExists(todoId, userId)) {
    logger.error("Failed to generate upload url ", {
      message: "TODO does not exist",
      todoId: todoId
    });
    return generateReponse(404, {
      error: 'TODO does not exist'
    });
  }

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  let url = "";
  try {
    url = await getUploadUrl(todoId);
    await addAttachmentUrl(todoId, userId, url.attachmentUrl);
  } catch (ex) {
    logger.error(`Unable to create upload url: ${ex.message}`);
    return generateReponse(500, {
      message: `Unable to create upload url: ${ex.message}`
    })
  }

  logger.info(`Upload url has been generated successfully, ${url.uploadUrl} `);

  return generateReponse(201, {
    uploadUrl: url.uploadUrl
  })
})
