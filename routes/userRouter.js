const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.logIn);

router.route("/forgotpassword").post(authController.forgotPassword);

router.use(authController.protect);

router.route("/updatepassword").patch(authController.updatePassword);
router.route("/me").get(authController.getMe);
module.exports = router;
