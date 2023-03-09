const catchAsync = require("../util/catchAsync");
const AppError = require("../util/AppError");
const { render } = require("pug");

function renderError(
  errMessage,
  statusCode,
  title,
  res,
  renderLoginOrRegister = true
) {
  res.render("error", { title, errMessage, statusCode, renderLoginOrRegister });
}

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
  const { user } = req;

  if (!user)
    return renderError(
      "You are not loged in. Please login and try again.",
      400,
      "Profile",
      res
    );

  res.render("profile", { title: "Account" });
};

exports.feature = function (req, res, next) {
  const { feature } = req.params;
  const { user } = req;

  if (!user)
    return renderError(
      `You are not loged in. Please login or register to get access to ${feature
        .split("-")
        .join(" ")}.`,
      400,
      feature,
      res
    );

  res.render("feature", { title: feature });
};

exports.faqs = function (req, res, next) {
  res.render("faqs", { title: "Faqs" });
};

exports.terms = function (req, res, next) {
  res.render("terms", { title: "Terms" });
};

exports.dashboard = function (req, res, next) {
  const { user } = req;

  if (!user)
    return renderError(
      "You are not loged in. Please login or register to see your dashboard.",
      400,
      "Feature",
      res
    );

  res.render("dashboard", { title: "Dashboard" });
};
