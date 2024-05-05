import { getSingleTodo, getAllTodos, createNewTodo, deleteSingleTodo, updateSingleTodo, addAttachmentUrlToTodo } from "../dataLayer/Todo.mjs"
import { v4 as uuidv4 } from 'uuid'

export async function todoExists(todoId, userId) {
    const result = await getSingleTodo(todoId, userId);
    return !!result;
}

export async function getTodos(userId) {
    const result = await getAllTodos(userId);
    return result;
}

export async function createTodo(newTodo, userId) {
    const itemId = uuidv4();

    const newItem = {
      "todoId": itemId,
      "userId": userId,
      "attachmentUrl": "",
      "createdAt": new Date().toISOString(),
      ...newTodo,
      "done": false
    }

    await createNewTodo(newItem);

    return newItem;
}

export async function updateTodo(todoId, userId, newTodo) {
    await updateSingleTodo(todoId, userId, newTodo);
    return;
}

export async function deleteTodo(todoId, userId) {
    await deleteSingleTodo(todoId, userId);
    return;
}

export async function addAttachmentUrl(todoId, userId, attachmentUrl) {
    await addAttachmentUrlToTodo(todoId, userId, attachmentUrl);
    return;
}