const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../model/user");
const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");

function filterObj(obj, ...toBeFiltered) {
  toBeFiltered.forEach((field) => {
    delete obj[field];
  });

  return { ...obj };
}

function signAndSend(user, statusCode, res) {
  const token = jwt.sign(
    { id: user._id, iat: Date.now() / 1000 + 10 },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  const cookieOpt = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOpt);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
}

exports.signUp = catchAsync(async function (req, res, next) {
  const { name, email, role, password, passwordConfirm, photo } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    photo,
    role,
  });

  signAndSend(user, 201, res);
});

exports.logIn = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Both email and password are required.", 400));

  const user = await User.findOne({ email }).select("+password");

  const isPasswordCorrect = await user?.isCorrect(password);
  if (!isPasswordCorrect)
    return next(new AppError("Invalid email or password", 400));

  signAndSend(user, 200, res);
});

exports.forgotPassword = catchAsync(async function (req, res, next) {
  const { email } = req.body;

  if (!email) return next(new AppError("Email is required", 400));

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

exports.protect = catchAsync(async function (req, res, next) {
  const { authorization } = req.headers;
  const token =
    (authorization?.startsWith("Bearer") && authorization.split(" ")[1]) ||
    req.cookies.jwt;

  if (!token)
    return next(
      new AppError("You are not loged in. Please login and try again.", 401)
    );

  const { id, iat } = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(id).select("+password");

  if (user.isPassChangedAfter(iat))
    return next(
      new AppError(
        "You have changed password recently. Please login again to get access.",
        401
      )
    );

  req.user = user;

  next();
});

exports.strictTo = function (...role) {
  return catchAsync(async function (req, res, next) {
    const { user } = req;

    if (!role.includes(user.role))
      return next(new AppError("You are not allowed for this action.", 401));

    next();
  });
};

exports.updatePassword = catchAsync(async function (req, res, next) {
  const { currentPassword, password, passwordConfirm } = req.body;
  const { user } = req;
  if (!currentPassword || !password || !passwordConfirm)
    return next(
      new AppError(
        "All fields are required. please provide currentPassword, password, and passwordConfirm.",
        400
      )
    );

  if (!(await user.isCorrect(currentPassword)))
    return next(
      new AppError(
        "The password you entered is incorrect. Please provide the correct current password.",
        400
      )
    );

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  signAndSend(user, 201, res);
});

exports.getMe = catchAsync(async function (req, res, next) {
  const { user } = req;

  user.password = undefined;
  user.passwordChangedAt = undefined;

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async function (req, res, next) {
  const { user } = req;
  const data = req.body;

  if (data.password || data.passwordConfirm)
    return next(
      new AppError(
        "This route is not for password update. Please use /updatePassword route.",
        400
      )
    );

  const filteredData = filterObj(
    data,
    "role",
    "plan",
    "passwordChangedAt",
    "resetToken",
    "resetTokenExpiry"
  );

  Object.keys(filteredData).forEach((key) => {
    user[key] = filteredData[key];
  });

  const updatedUser = await User.findByIdAndUpdate(user._id, filteredData, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      updatedUser,
    },
  });
});
