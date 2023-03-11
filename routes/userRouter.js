const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/usersController");

const router = express.Router();

router.route("/signup").post(authController.isLogedin,authController.signUp);
router.route("/login").post(authController.logIn);
router.route("/forgotpassword").post(authController.forgotPassword);
router.route("/resetpassword/:token").post(authController.resetPassword);

router.use(authController.protect);

router.route("/updateMe").post(authController.updateMe);
router.route("/logout").get(authController.logout);

router.route("/updatepassword").patch(authController.updatePassword);
router.route("/me").get(authController.getMe);

router.use(authController.strictTo("admin", "dev"));

// Admin
router
  .route("/")
  .get(userController.getAllUsers)
  .delete(userController.deleteAll);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
