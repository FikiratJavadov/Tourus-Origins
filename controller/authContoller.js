const User = require("../model/user");
const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");

const signJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
};

exports.signup = asyncCatch(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  //! Give the permission

  const token = signJWT(user._id);

  res.status(201).json({
    success: true,
    user,
    token,
  });
});

exports.login = asyncCatch(async (req, res, next) => {
  //1) Email and password is exist
  const { email, password } = req.body;

  if (!email || !password)
    return next(new GlobalError("Please provide email and passoword!", 404));

  //2) Is there person with this email
  const user = await User.findOne({ email });
  //3) CORRECT PASSWORD
  const pw = await user.checkPasswords(password);

  if (!user || !pw)
    return next(new GlobalError("Please check email or passoword!", 403));

  //4) SIGN TOKEN
  const token = signJWT(user._id);

  res.status(201).json({
    success: true,
    token,
  });
});
