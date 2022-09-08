const GlobalErorr = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { asyncCatch } = require("../utils/asyncCatch");

const protectAuth = asyncCatch(async (req, res, next) => {
  let token;

  //! Check if header auth provided
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new GlobalErorr("Token is not defined", 400));

  //! check if token valid
  const promiseVerify = promisify(jwt.verify);

  const decodedData = await promiseVerify(token, process.env.JWT_SECRET);
  console.log(decodedData);

  next();

  // jwt.verify(token, process.env.JWT_SECRET, function (err, userData) {
  //   if (err) next(err);

  //   next();
  // });
});

module.exports = protectAuth;
