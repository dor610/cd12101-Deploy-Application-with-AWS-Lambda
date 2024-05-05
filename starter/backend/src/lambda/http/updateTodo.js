import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { todoExists, updateTodo } from '../../businessLogic/TodoService.mjs'
import { generateReponse, generateReponseWithoutBody } from '../../response/GenericResponse.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger('update');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  ).handler(async (event) =>  {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body);
  const userId = getUserId(event);
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  let exist = todoExists(todoId, userId);
  if (!exist) {
    logger.error(`Failed to update TODO: "${todoId}" does not exist `);
    return generateReponse(404, {
      error: 'TODO does not exist'
    });
  }

  try {
    await updateTodo(todoId, userId, updatedTodo);
  } catch (ex) {
    logger.error(`Failed to update TODO: ${ex.message} `);
    return generateReponse(500, {
      message: "Failed to update TODO ",
      detail: ex.message,
      todoId: todoId
    });
  }

  logger.info(`TODO has been updated successfully`)

  return generateReponseWithoutBody(204)
})
