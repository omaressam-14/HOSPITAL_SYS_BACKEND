const router = require("express").Router();
const roomController = require("../controllers/roomController");
const authController = require("../controllers/authController");

router.use(authController.protect, authController.restrictTo("admin"));

router
  .route("/")
  .get(roomController.getAllRoom)
  .post(roomController.createRoom);

router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

router
  .route("/:id/edit")
  .patch(roomController.addPatientToRoom)
  .delete(roomController.removePatientFromRoom);

module.exports = router;
