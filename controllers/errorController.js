const AppError = require("../util/AppError");
function handleDevErr(err, req, res) {
  if (req.originalUrl.startsWith("/api"))
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err,
      stack: err.stack,
    });
  else
    res.render("error", {
      title: "Something Went Wrong",
      errMessage: err.message,
      statusCode: err.statusCode,
    });
}

function handleCastError(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
}
function handleDuplicateErr(err) {
  const [key, value] = Object.entries(err.keyValue)[0];

  return new AppError(
    `There is a user with ${key}: ${value}, please use another ${key}`,
    400
  );
}

function handleWebTokenError() {
  return new AppError("Invalid Web Token, Please login and try again.", 400);
}

function handleValidationError(err) {
  console.log("lala");
  return new AppError(err.message, 400);
}

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  let error = { ...err };

  if (err.code === 11000) error = handleDuplicateErr(err);
  if (err.name === "JsonWebTokenError") error = handleWebTokenError();
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "CastError") error = handleCastError(err);

  if (process.env.NODE_ENV === "development") {
    return handleDevErr(error, req, res);
  }

  res.status(error.statusCode).json({
    status: err.Status,
    message: error.message,
    err,
  });
};

// operrors
// 1) CastError
// 2) ValidationError
