const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    minLength: [3, "User name must have a minimum length of 3 characters"],
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
  resetToken: String,
  resetTokenExpiry: Date,
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
