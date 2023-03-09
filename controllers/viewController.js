const catchAsync = require("../util/catchAsync");
const AppError = require("../util/AppError");

exports.home = function (req, res, next) {
  res.render("home", { title: "Home" });
};

exports.login = function (req, res, next) {
  res.render("login", { title: "Login" });
};

exports.signup = function (req, res, next) {
  res.render("signup", { title: "Register" });
};

exports.features = function (req, res, next) {
  res.render("features", { title: "Features" });
};

exports.pricing = function (req, res, next) {
  res.render("pricing", { title: "Pricing" });
};

exports.about = function (req, res, next) {
  res.render("about", { title: "About" });
};

exports.error = function (req, res, next) {
  res.render("error", { title: "Error" });
};

exports.profile = function (req, res, next) {
  res.render("profile", { title: "Account" });
};

exports.feature = function (req, res, next) {
  res.render("feature", { title: "Feature" });
};

exports.faqs = function (req, res, next) {
  res.render("faqs", { title: "Faqs" });
};

exports.terms = function (req, res, next) {
  res.render("terms", { title: "Terms" });
};

exports.dashboard = function (req, res, next) {
  res.render("dashboard", { title: "Dashboard" });
};
