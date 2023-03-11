const fs = require("fs");
const AppError = require("../util/AppError");

const features = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/features-description.json`, "utf-8")
);

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
    return next(
      new AppError("You are not loged in. Please login and try again.", 400)
    );

  res.render("profile", { title: "Account" });
};

exports.feature = function (req, res, next) {
  const { feature } = req.params;
  const { user } = req;

  if (!user)
    return next(
      new AppError(
        `You are not logged in. Please login or register to get access to ${feature
          .split("-")
          .join(" ")}.`,
        400
      )
    );

  const title = feature
    .split("-")
    .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase())
    .join(" ");

  res.render("feature", {
    title,
    ...features[feature.split("-").join("")],
  });
};

exports.faqs = function (req, res, next) {
  res.render("faqs", { title: "Faqs" });
};

exports.terms = function (req, res, next) {
  res.render("terms", { title: "Terms" });
};

exports.dashboard = function (req, res, next) {
  const { user } = req;

  return next(
    new AppError(
      "You are not loged in. Please login or register to see your dashboard.",
      400
    )
  );

  res.render("dashboard", { title: "Dashboard" });
};
