const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name!"],
  },

  email: {
    type: String,
    required: [true, "Please provide an email!"],
    unique: true,
    validate: validator.isEmail,
  },

  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password!"],
  },

  confirmPassword: {
    type: String,
    required: [true, "Please provide a confirm password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPasswords = async function (originalPassword) {
  return await bcrypt.compare(originalPassword, this.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
