const GlobalErorr = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { asyncCatch } = require("../utils/asyncCatch");
const User = require("../model/user");

const protectAuth = asyncCatch(async (req, res, next) => {
  let token;

  //! Check if header auth provided
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new GlobalErorr("Please Authenticate!", 400));
  console.log(token);

  //! check if token valid
  const promiseVerify = promisify(jwt.verify);

  const decodedData = await promiseVerify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedData.id);

  if (!user)
    return next(
      new GlobalErorr("The token belonging to this user not exists!")
    );

  req.user = user;

  next();

  // jwt.verify(token, process.env.JWT_SECRET, function (err, userData) {
  //   if (err) next(err);

  //   next();
  // });
});

module.exports = protectAuth;
