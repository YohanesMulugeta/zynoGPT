const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const userRouter = require("./routes/userRouter");
const appErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);

app.use("*", (req, res, next) => {
  res.status(501).json({
    status: "fail",
    message: "There is no route diffinition with this url on our server.",
  });
});

app.use(appErrorHandler);

module.exports = app;
