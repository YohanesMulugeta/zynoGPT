const User = require("../model/user");
const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");

exports.deleteUser = catchAsync(async function (req, res, next) {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "user deleted successfully",
  });
});
