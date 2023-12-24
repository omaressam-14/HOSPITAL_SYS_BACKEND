const router = require("express").Router();
const appointmentController = require("../controllers/appointmentController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(
    authController.protect,
    appointmentController.getAllAppointments
  )
  .post(
    authController.protect,
    authController.restrictTo("user", "nurse"),
    appointmentController.createAppointment
  );

router.use(
  authController.protect,
  authController.restrictTo("doctor", "admin", "nures")
);

router
  .route("/:id")
  .get(appointmentController.getAppointment)
  .patch(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

module.exports = router;
