const jwt = require("jsonwebtoken");

const User = require("../model/user");
const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");

function signAndSend(user, statusCode, res) {
  const token = jwt.sign(
    { id: user._id, iat: Date.now() / 1000 - 30 },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  const cookieOpt = {
    expires: Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", cookieOpt);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
}

exports.signUp = catchAsync(async function (req, res, next) {
  const { name, email, password, passwordConfirm, photo, plan } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    photo,
    plan,
  });

  signAndSend(user, 201, res);
});

exports.logIn = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  const isPasswordCorrect = await user?.isCorrect(password);
  if (!isPasswordCorrect)
    return next(new AppError("Invalid email or password", 400));

  signAndSend(user, 200, res);
});

exports.forgotPassword = catchAsync(async function (req, res, next) {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError(`There is no user with ${email} address.`, 404));

  const str = await user.createForgotToken();

  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: { str },
  });
});
