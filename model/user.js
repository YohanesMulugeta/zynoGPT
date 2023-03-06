const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    min: [3, "User name must have a minimum length of 3 characters"],
  },
  email: {
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
      validator: function (value) {
        return value === this.password;
      },
      message: "passwordConfirm must be the same as password",
    },
  },
  photo: String,
  plan: {
    type: String,
    enum: ["free", "gold", "diamond"],
    default: "free",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
