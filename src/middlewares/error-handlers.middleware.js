// NOT FOUND
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

//ERROR HANDLER
const errorHandler = (err, req, res, next) => {
  // set status code to 200 if status code is 200
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
}

module.exports = {
    notFound,
    errorHandler,
}