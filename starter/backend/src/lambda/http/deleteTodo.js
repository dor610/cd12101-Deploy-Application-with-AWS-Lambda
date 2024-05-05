import { getUserId } from '../utils.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { todoExists, deleteTodo } from '../../service/TodoService.mjs';
import { generateReponse, generateReponseWithoutBody } from '../../response/GenericResponse.mjs';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'

const logger = createLogger('delete');

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  ).handler(async (event) => {
        const todoId = event.pathParameters.todoId;
        const userId = getUserId(event);
        // TODO: Remove a TODO item by id
        if (!todoExists(todoId, userId)) {
          logger.error(`Fail to delete TODO, "${todoId}" does not exist `)
          return generateReponse(404, {
            error: 'TODO does not exist'
          });
        }

        try {
          await deleteTodo(todoId, userId);
        } catch (ex) {
          logger.error(`Failed to delete TODO: ${ex.message}`);
          return generateReponse(500, {
            message: "Failed to delete TODO ",
            detail: ex.message,
            todoId: todoId
          });
        }

        logger.info(`Deleted sucessfully: ${todoId}`)

        return generateReponseWithoutBody(204);
      }
      )