module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // If no status code already defined, default to 500 - Internal Server Error
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
