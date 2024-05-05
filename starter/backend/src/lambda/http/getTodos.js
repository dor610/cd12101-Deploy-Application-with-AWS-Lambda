import { createLogger } from '../../utils/logger.mjs'
import { getTodos } from '../../businessLogic/TodoService.mjs';
import { getUserId } from '../utils.mjs'
import { generateReponse } from '../../response/GenericResponse.mjs';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger('get');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  ).handler(async (event) =>  {
  // TODO: Get all TODO items for a current user

  let userId = getUserId(event);
  const result = await getTodos(userId);
  logger.info("Get TODOS: " + result.Items.length);

  return generateReponse(200, {
    items: result.Items
  })
})
