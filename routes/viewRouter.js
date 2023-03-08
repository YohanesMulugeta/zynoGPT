const express = require("express");

const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/", viewController.home);
router.get("/login", viewController.login);
router.get("/signup", viewController.signup);

module.exports = router;
