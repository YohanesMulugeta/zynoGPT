const axios = require("axios");
const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");

exports.checkWordsLeft = catchAsync(async function (req, res, next) {
  const { user } = req;

  // wordsUpdatedAt
  if (user.wordsUpdatedAt + 30 * 24 * 60 * 60 * 1000 >= Date.now()) {
    user.plan = "free";

    await user.save({ runValidatorsBeforeSave: false });
    return next();
  }

  // --------- generate unlimited for diamond users
  if (user.plan === "diamond") return next();

  if (user.wordsLeft <= process.env[`WORDS_${user.plan.trim().toUpperCase()}`])
    return next(
      new AppError(
        "You have finished your words per month. Please upgrade your plan or wait for next month to get access to this  feature."
      )
    );

  next();
});

exports.generateText = catchAsync(async function (req, res, next) {
  const { user } = req;

  const response = await axios.post(
    process.env.GPT_ENDPOINT,
    {
      prompt: req.body.prompt,
      max_tokens: user.wordsLeft,
      model: "text-davinci-003",
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GPT_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.status(200).json({
    status: "success",
    data: response.data,
  });
});
