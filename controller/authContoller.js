const User = require("../model/user");
const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const Email = require("../utils/email");
const cloudinary = require("../utils/cloudinary");

const signJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
};

exports.signup = asyncCatch(async (req, res, next) => {
  // let image;
  // if (req.file) {
  //   image = await cloudinary.uploader.upload(req.file.path);
  // }

  // console.log(image);

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  //! Give the permission

  //!Send Email
  const url = `${req.protocol}://${req.get("host")}`;
  const emailHandler = new Email(user, url);
  await emailHandler.sendWelcome();

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
    user,
  });
});

exports.forgetPassword = asyncCatch(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return next(new GlobalError("User with this email does not exist!", 404));

  const resetToken = await user.hashResetPassword();
  await user.save({ validateBeforeSave: false });

  const urlString = `${req.protocol}://${req.get("host")}/${resetToken}`;

  const emailHandler = new Email(user, urlString);
  await emailHandler.sendResetPassword();

  res.status(200).json({
    success: true,
    message: "Email sent!",
  });
});

exports.resetPassword = asyncCatch(async (req, res, next) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;

  const hashedPassword = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetToken: hashedPassword,
    resetTime: { $gt: new Date() },
  });

  if (!user) return next(new GlobalError("Token wrong or expired"));

  user.password = password;
  user.confirmPassword = confirmPassword;
  user.resetToken = undefined;
  user.resetTime = undefined;
  await user.save();

  const accessToken = signJWT(user._id);

  res.json({
    success: true,
    token: accessToken,
  });
});
