const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    minLength: [3, "User name must have a minimum length of 3 characters"],
  },
  userName: {
    type: String,
    required: [true, "User is required to set user name."],
    maxLength: [8, "User name should not be greater than 8 characters."],
    minLength: [3, "User name should not be less than 3 cahracters"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minLength: [8, "User password length must be greater than or equal to 8."],
    select: false,
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
  resetToken: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ["user", "admin", "dev"],
    default: "user",
  },
});

// ---------------------- MIDDLWARES

// encryption of password and setting reset token and password confirm to undefined
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.passwordConfirm = undefined;
  this.resetToken = undefined;
  this.resetTokenExpiry = undefined;

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// set password changed at field
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

// --------------------------- METHODS
userSchema.methods.isCorrect = async function (candidatePass) {
  return await bcrypt.compare(candidatePass, this.password);
};

userSchema.methods.createForgotToken = function () {
  const randStr = crypto.randomBytes(20).toString("hex");

  const token = crypto.createHash("sha256").update(randStr).digest("hex");

  this.resetToken = token;
  this.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  return randStr;
};

userSchema.methods.isPassChangedAfter = function (date) {
  if (!this.passwordChangedAt) return false;

  return this.passwordChangedAt / 1000 > date;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
