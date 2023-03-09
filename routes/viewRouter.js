const express = require("express");

const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLogedin);

router.get("/", viewController.home);
router.get("/login", viewController.login);
router.get("/register", viewController.signup);
router.get("/features", viewController.features);
router.get("/pricing", viewController.pricing);
router.get("/about", viewController.about);
router.get("/error", viewController.error);
router.get("/faqs", viewController.faqs);
router.get("/terms", viewController.terms);

router.get("/profile", viewController.profile);
router.get("/features/:feature", viewController.feature);
router.get("/dashboard", viewController.dashboard);

module.exports = router;
