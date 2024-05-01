
export async function handler(event) {
  const todoId = event.pathParameters.todoId
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return undefined
}

