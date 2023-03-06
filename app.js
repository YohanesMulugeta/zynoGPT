const express = require("express");

const userRouter = require("./routes/userRouter");

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
  res
    .status(404)
    .json({
      status: "fail",
      message: "There is no route diffinition with this url on our server.",
    });
});

module.exports = app;
