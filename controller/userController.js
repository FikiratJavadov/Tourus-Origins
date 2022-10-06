const User = require("../model/user");
const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const { getOne } = require("../utils/factory");
const cloudinary = require("../utils/cloudinary");

const signJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
};

exports.changePassword = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const isOkay = await user.checkPasswords(req.body.currentPassword);

  if (!isOkay) return next(new GlobalError("Incorrect password!", 403));

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  const token = signJWT(user._id);

  res.json({
    success: true,
    token,
  });
});

exports.changeUserData = asyncCatch(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true }
  );

  res.json({
    success: true,
    user,
  });
});

exports.deleteMe = asyncCatch(async (req, res, next) => {
  const me = await User.findById(req.user._id);

  if (me.imgId) {
    await cloudinary.uploader.destroy(me.imgId);
  }

  me.delete();

  res.json({
    success: true,
    message: "User deleted",
  });
});
