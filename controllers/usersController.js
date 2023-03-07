const User = require("../model/user");
const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");

exports.getUser = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user)
    return next(
      new AppError("No user with this id. please provide valid id.", 400)
    );

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.updateUser = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!user) return next(new AppError("NO user with this id.", 400));

  res.status(200).json({
    status: "success",
    data: { updatedUser: user },
  });
});

exports.deleteUser = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "user deleted successfully",
  });
});
