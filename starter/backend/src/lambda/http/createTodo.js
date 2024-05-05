import { getUserId } from '../utils.mjs';
import { createLogger } from '../../utils/logger.mjs';
import { generateReponse, generateReponseWithoutBody } from '../../response/GenericResponse.mjs';
import { createTodo } from '../../businessLogic/TodoService.mjs';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger('create');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  ).handler(async (event) => {
  let userId = getUserId(event);
  const newTodo = JSON.parse(event.body)
  // TODO: Implement creating a new TODO item
  if(!(newTodo.name.match(/\S+?$/))) { return generateReponseWithoutBody(400) } 
  
  let item = "";
  try {
    item = await createTodo(newTodo, userId);
  } catch(ex) {
    logger.error(`Failed to create TODO: ${ex.message}`);
    return generateReponse(500, {
      message: "Failed to create TODO ",
      detail: ex.message,
      todo: newTodo
    });
  }

  logger.info(`Create TODO: ${item.todoId}`);
  return generateReponse(201, {
    item: item
  });
});

