const catchAsync = require("../util/catchAsync");
const AppError = require("../util/AppError");

exports.login = function (req, res, next) {
  res.render("login");
};

exports.home = function (req, res, next) {
  res.render("base");
};
