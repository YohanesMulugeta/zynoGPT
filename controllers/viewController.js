const catchAsync = require("../util/catchAsync");
const AppError = require("../util/AppError");

exports.login = function (req, res, next) {
  res.render("login");
};

exports.home = function (req, res, next) {
  res.render("home");
};

exports.signup = function (req, res, next) {
  res.render("signup");
};

exports.features = function (req, res, next) {
  res.render("features");
};

exports.pricing = function (req, res, next) {
  res.render("pricing");
};

exports.about = function (req, res, next) {
  res.render("about");
};

exports.error = function (req, res, next) {
  res.render("error");
};

exports.profile = function (req, res, next) {
  res.render("profile");
};

exports.feature = function (req, res, next) {
  res.render("feature");
};
