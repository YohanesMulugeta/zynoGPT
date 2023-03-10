const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

const User = require("../model/user");
const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");
const Mail = require("../util/mail");

function filterObj(obj, ...toBeFiltered) {
  toBeFiltered.forEach((field) => {
    delete obj[field];
  });

  return { ...obj };
}

function signToken(id) {
  return jwt.sign(
    { id: id, iat: Date.now() / 1000 + 10 },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
}

function signAndSend(user, statusCode, res) {
  const token = signToken(user._id);

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

// -------------------------------- SIGNUP

exports.signUp = catchAsync(async function (req, res, next) {
  if (req.user)
    return next(
      new AppError(
        "You are already loged in. Please logout and try again.",
        400
      )
    );

  const { name, email, password, passwordConfirm, userName } = req.body;

  const user = await User.create({
    name: name.trim(),
    email: email.trim(),
    password: password.trim(),
    passwordConfirm: passwordConfirm.trim(),
    userName:
      userName?.trim().slice(0, 1).toUpperCase() + userName?.trim().slice(1),
  });

  const emailVerificationToken = user.createEmailVerificationToken();
  const url = `${req.protocol}://${req.hostname}:8000/api/v1/users/verifyemail/${emailVerificationToken}`;

  user.save({ validateBeforeSave: false });

  try {
    await new Mail(user, url).sendEmailVerification();
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    return next(
      new AppError("Sorry something went wrong, Please try again.", 500)
    );
  }

  // await new Mail(user, `${req.protocol}://${req.hostname}/`).sendWelcome();
  // signAndSend(user, 201, res);

  setTimeout(async () => {
    await User.findOneAndDelete({ _id: user._id, emailVerified: false });
  }, process.env.EMAIL_VERIFICATION * 60 * 1000);

  res.status(201).json({
    status: "success",
    message:
      "We have sent an email verification link to your email. Please verify your email within 30 minutes.",
    emailVerificationToken,
  });
});

// ------------------------------- VERIFY EMAIL
exports.verifyEmail = catchAsync(async function (req, res, next) {
  // Recive token
  const { token } = req.params;

  // 2) ENCRYPT TOKEN
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 3) FINGD THE USER WITH THIS TOKEN IF NO THROW ERROR
  const user = await User.findOne({ emailVerificationToken: encryptedToken });
  if (!user)
    return next(new AppError("No user with this verification link.", 404));

  // delete user if there is a user with expired token
  if (user.emailVerificationExpiry.getTime() < Date.now()) {
    User.findByIdAndDelete(user._id).exec();

    return next(
      new AppError(
        "Email verification expired please sign up again and verify your email.",
        400
      )
    );
  }
  // 4) UPDATE THE USER EMAILvERIFIED FIELD TO UNDEFINED
  user.emailVerified = undefined;
  user.emailVerificationExpiry = undefined;
  user.emailVerificationToken = undefined;

  await user.save({ validateBeforeSave: false });

  const signInToken = signToken(user._id);

  const cookieOpt = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", signInToken, cookieOpt);

  // 5) SEND SUCCESS MESSAGE
  res.status(200).redirect("/");
});

// ------------------------------- LOGIN

exports.logIn = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Both email and password are required.", 400));

  const user = await User.findOne({ email }).select("+password");

  if (user.emailVerified === false)
    return next(new AppError("Please verify your email inorder to login", 400));

  const isPasswordCorrect = await user?.isCorrect(password);
  if (!isPasswordCorrect)
    return next(new AppError("Invalid email or password", 400));

  signAndSend(user, 200, res);
});

// ------------------------- FROTGOT PASSWORD
exports.forgotPassword = catchAsync(async function (req, res, next) {
  const { email } = req.body;

  if (!email) return next(new AppError("Email is required", 400));

  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError(`There is no user with ${email} address.`, 404));

  const token = await user.createForgotToken();

  await user.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.hostname}/${token}`;

  await new Mail(user, url).sendResetPasswordLInk();

  res.status(200).json({
    status: "success",
    message: `Password Reset link is sent to your email address: ${user.email}`,
  });
});

// ----------------------------- RESET PASSWORD
exports.resetPassword = catchAsync(async function (req, res, next) {
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;

  const encrypted = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({ resetToken: encrypted }).select(
    "+resetTokenExpiry"
  );

  if (!user)
    return next(new AppError("There is no user with this reset link.", 400));

  if (Date.now() > user.resetTokenExpiry)
    return next(
      new AppError(
        "Your reset link is expired. Please request another link and try again.",
        400
      )
    );

  if (!password || !passwordConfirm)
    return next(
      new AppError(
        "Please provide both password and passwordConfirm fields",
        400
      )
    );

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  const updatedUser = await user.save();

  signAndSend(updatedUser, 200, res);
});

// ------------------------ isLogedIn

exports.isLogedin = catchAsync(async function (req, res, next) {
  try {
    const { authorization } = req.headers;

    const token =
      (authorization?.startsWith("Bearer") && authorization.split(" ")[1]) ||
      req.cookies.jwt;

    if (!token) return next();

    const { id, iat } = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(id).select("+password");

    if (!user || user.isPassChangedAfter(iat)) return next();

    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    return next();
  }
});

exports.logout = function (req, res, next) {
  const cookieOpt = {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", "", cookieOpt);

  res.status(200).json({ status: "success", message: "Logout successful." });
};

// ------------------------ PROTECT
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

  if (!user)
    return next(
      new AppError(
        "There is no user with this token. Pleaase login and try again.",
        400
      )
    );

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

// ------------------------------- STRICT TO

exports.strictTo = function (...role) {
  return catchAsync(async function (req, res, next) {
    const { user } = req;

    if (!role.includes(user.role))
      return next(new AppError("You are not allowed for this action.", 401));

    next();
  });
};

// -------------------------------------- UPDATE PASSWORD

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

// --------------------------------- GET ME

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

// ------------------------------- UPDATE ME

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
