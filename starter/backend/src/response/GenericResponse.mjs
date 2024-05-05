export function generateReponse(statusCode, bodyData) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(bodyData)
      }
}

export function generateReponseWithoutBody(statusCode) {
    return {
        statusCode: statusCode
      }
}