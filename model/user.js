const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    min: [3, "User name must have a minimum length of 3 characters"],
  },
  emai: {
    type: String,
    required: [true, "User must have an email"],
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    min: [8, "User password must be greater than or equal to 8."],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Users must confirm their password."],
    validate: {
      validator: (value) => value === this.password,
      message: "passwordConfirm must be the same as password",
    },
  },
  photo: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
