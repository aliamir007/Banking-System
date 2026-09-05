export const sendSuccess = (res, { statusCode = 200, message = 'Success', data = {} }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, { statusCode = 500, message = 'Something went wrong', code = 'ERROR', details = null }) => {
  const payload = {
    success: false,
    message,
    error: { code },
  };
  if (details) payload.error.details = details;

  return res.status(statusCode).json(payload);
};

export const sendValidationError = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
};