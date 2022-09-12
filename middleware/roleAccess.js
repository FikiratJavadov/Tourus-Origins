const GlobalError = require("../error/GlobalError");

const roleAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new GlobalError("User has not permission!"));
    next();
  };
};

module.exports = roleAccess;
