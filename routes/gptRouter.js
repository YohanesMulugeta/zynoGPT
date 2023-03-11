const express = require("express");
const gptController = require("../controllers/gptController");

const router = express.Router();

router.route("/").post(gptController.generateText);

module.exports = router;
