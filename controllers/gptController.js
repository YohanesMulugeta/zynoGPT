const axios = require("axios");
const catchAsync = require("../util/catchAsync");

exports.generateText = catchAsync(async function (req, res, next) {
  const response = await axios.post(
    process.env.GPT_ENDPOINT,
    {
      prompt: req.body.prompt,
      max_tokens: 200,
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
