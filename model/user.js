const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    min: [3, "User name must have a minimum length of 3 characters"],
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
    min: [8, "User password length must be greater than or equal to 8."],
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
});

userSchema.pre("save", async function (next) {
  this.passwordConfirm = undefined;

  !this.isModified("password") && next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.isCorrect = async function (candidatePass) {
  return await bcrypt.compare(candidatePass, this.password);
};

userSchema.methods.createForgotToken = function () {
  const randStr = crypto.randomBytes(20).toString("hex");

  const token = crypto.createHash("sha256").update(randStr).digest("hex");

  this.resetToken = token;

  return randStr;
};

// const yohanes = {
//   name: "yohanes",
//   email: "ain@example.com",
//   password: "lalanewzare",
//   passwordConfirm: "lalanewzare",
// };

const User = mongoose.model("User", userSchema);

// (async () => {
//   console.log(await User.findOne({ name: "yohanes" }));

//   console.log("success");
// })();

module.exports = User;
