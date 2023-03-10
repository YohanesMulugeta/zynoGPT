const catchAsync = require("../util/catchAsync");
const AppError = require("../util/AppError");
const { render } = require("pug");

const features = {
  leaveletterwriting: {
    head1: "Write your Name here.",
    head2:
      "Write the person's name or role in which you are going to send the letter here.",
    head3: "Write the number of days you want leave.",
    head4: "Write a small description of the reason here.",
  },
  coverletterwriting: {
    head1: "Write your Name here.",
    head2: "Write your Desired Job Title here.",
    head3: "Write your Skill set here.",
    head4: "Write your a small description about yourself here.",
  },
  essaywriting: {
    head1: "Write your Essay Title here.",
    head2: "Write a small description here.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  assignmentwriting: {
    head1: "Write your Assignment Title here.",
    head2: "Write a small description here.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  brandnamegenerator: {
    head1: "Write your desired words to be included.",
    head2:
      "Write a small description you have in your mind about your business.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  socialmediacaptions: {
    head1: "Write your post's Title here.",
    head2: "Write a small description here.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  textexpander: {
    head1: "Paste your original content here.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  textparaphrase: {
    head1: "Paste your original content here.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  startupideasgenerator: {
    head1: "Write your idea in a single line.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  hashtagsgenerator: {
    head1: "Write your idea in a single line.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  youtubevideodescriptiongenerator: {
    head1: "Write your video title here.",
    head2: "Write some keywords related to video.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
  youtubevideoscriptgenerator: {
    head1: "Write your desired video title here.",
    head2: "Write some keywords related to video.",
    featureDescription:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae velit nam consectetur, in ullam natus pariatur aliquid. Aut, magnam!",
  },
};

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

  if (!user)
    return renderError(
      "You are not loged in. Please login or register to see your dashboard.",
      400,
      "Feature",
      res
    );

  res.render("dashboard", { title: "Dashboard" });
};
