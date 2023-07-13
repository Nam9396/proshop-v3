

const customError = (message, statusCode) => {
  const error = new Error(message);
  error.status = statusCode;
  return error;
}

export default customError;