const axios = require("axios");
const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");

exports.checkWordsLeft = catchAsync(async function (req, res, next) {
  const { user } = req;

  // wordsUpdatedAt

  if (user.wordsUpdatedAt.getTime() + 30 * 24 * 60 * 60 * 1000 <= Date.now()) {
    user.plan = "free";
    user.wordsLeft = process.env.WORDS_FREE;
    user.wordsUpdatedAt = Date.now();

    await user.save({ validateBeforeSave: false });

    return next();
  }

  // --------- generate unlimited for diamond users
  if (user.plan === "diamond") return next();

  if (+user.wordsLeft <= 0)
    return next(
      new AppError(
        "You have finished your words per month. Please upgrade your plan or wait for next month to get access to this  feature.",
        400
      )
    );

  next();
});

exports.generateText = catchAsync(async function (req, res, next) {
  const { user } = req;
  const { prompt } = req.body;
  const max_tokens = +user.wordsLeft > 1000 ? 1000 : user.wordsLeft;

  const { data } = await axios.post(
    process.env.GPT_ENDPOINT,
    {
      prompt,
      max_tokens,
      model: "text-davinci-003",
      temperature: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GPT_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  // res.end();
  user.wordsLeft = user.wordsLeft - data.usage.completion_tokens;

  console.log(user.wordsLeft - data.usage.completion_tokens);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: data,
  });
});
