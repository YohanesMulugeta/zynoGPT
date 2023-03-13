const express = require("express");
const gptController = require("../controllers/gptController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/generateText")
  .post(
    authController.protect,
    gptController.checkWordsLeft,
    gptController.generateText
  );

module.exports = router;
