const GlobalError = require("../error/GlobalError");

const sendProductionError = (err, req, res, next, statusCode) => {
  if (err.operational) {
    res.status(statusCode).json({
      message: err.message,
      success: false,
    });
  } else {
    res.status(500).json({
      message: "Something very very wrong!",
      success: false,
    });
  }
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((err) => err.message);
  const finalErr = errors.join(",");

  return new GlobalError(finalErr, 400);
};

const handleCastError = (err) => {
  return new GlobalError("Provide a valid Object ID!");
};

const handleJWTError = (err) => {
  return new GlobalError("Token is not valid!", 403);
};

const handleJWTEXPIRE = (err) => {
  return new GlobalError("Token expired! Log in again", 403);
};

module.exports = (err, req, res, next) => {
  statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      success: false,
      message: err.message,
      err: err,
      status: statusCode,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "ValidationError") err = handleValidationError(err);
    if (err.name === "CastError") err = handleCastError(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);
    if (err.name === "TokenExpiredError") err = handleJWTEXPIRE(err);

    sendProductionError(err, req, res, next, statusCode);
  }
};
