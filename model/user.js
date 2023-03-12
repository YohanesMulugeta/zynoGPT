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
    validate: {
      validator: function (value) {
        return !value.trim().split("").includes(" ");
      },
      message: "userName can not include spaces. Please try again.",
    },
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
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpiry: Date,
  emailVerified: Boolean,
});

function generateRandomToken() {
  const randStr = crypto.randomBytes(20).toString("hex");

  const token = crypto.createHash("sha256").update(randStr).digest("hex");

  return [token, randStr];
}

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

userSchema.pre("save", function (next) {
  if (this.isNew) this.emailVerified = false;

  next();
});

// Formate Name
userSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();

  let [firstName, lastName] = this.name.split(" ");

  firstName = firstName.slice(0, 1).toUpperCase() + firstName.slice(1);
  lastName = lastName
    ? lastName.slice(0, 1).toUpperCase() + lastName.slice(1)
    : "";

  this.name = `${firstName} ${lastName}`;

  next();
});

// --------------------------- METHODS
userSchema.methods.isCorrect = async function (candidatePass) {
  return await bcrypt.compare(candidatePass, this.password);
};

// Email Verification Token Generator
userSchema.methods.createEmailVerificationToken = function () {
  const [token, randStr] = generateRandomToken();

  this.emailVerificationToken = token;
  this.emailVerificationExpiry = new Date(
    Date.now() + process.env.EMAIL_VERIFICATION * 60 * 1000
  );

  return randStr;
};

userSchema.methods.createForgotToken = function () {
  const [token, randStr] = generateRandomToken();

  this.resetToken = token;
  this.resetTokenExpiry = new Date(
    Date.now() + process.env.RESET_EXPIRY * 60 * 1000
  );

  return randStr;
};

userSchema.methods.isPassChangedAfter = function (date) {
  if (!this.passwordChangedAt) return false;

  return this.passwordChangedAt / 1000 > date;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
