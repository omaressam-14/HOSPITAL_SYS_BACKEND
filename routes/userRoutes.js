const router = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { uploadSinglePhoto, resizePhoto } = require("../utils/uploadImgs");
const reviewRoutes = require("./reviewRoutes");
const medicalRecordRoutes = require("./medicalRecordRoutes");

router.use("/:userId/reviews", reviewRoutes);
router.use("/:userId/records", medicalRecordRoutes);

router.route("/signup").post(authController.signUp);

router.route("/signin").post(authController.signIn);

router
  .route("/me")
  .get(authController.protect, userController.getMe, userController.getUser);

router.patch(
  "/updateMe",
  authController.protect,
  uploadSinglePhoto,
  resizePhoto("users"),
  authController.updateMe
);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.post("/forgetPassword", authController.forgetPassword);
router.post("/resetPassword/:token", authController.resetPassword);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.route("/:id").get(userController.getUser);

////////////////ADMIN////////////////////////////////////////////////////

router.use(authController.protect, authController.restrictTo("admin"));
router
  .route("/:id")
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

module.exports = router;
