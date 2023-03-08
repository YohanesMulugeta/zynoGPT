const express = require("express");

const viewController = require("../controllers/viewController");

const router = express.Router();

router.get("/", viewController.home);
router.get("/login", viewController.login);
router.get("/register", viewController.signup);
router.get("/features", viewController.features);
router.get("/pricing", viewController.pricing);
router.get("/about", viewController.about);
router.get("/error", viewController.error);

module.exports = router;
