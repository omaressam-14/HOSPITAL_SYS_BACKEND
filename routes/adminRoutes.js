const router = require("express").Router();
const adminController = require("../controllers/adminController");
const authController = require("./../controllers/authController");
const handleFactory = require("../controllers/handleFactory");
const Doctor = require("../models/doctorModel");

router.use(authController.protect, authController.restrictTo("admin"));

router.route("/employee").post(adminController.createEmployee);

router.route("/stats/patients").get(adminController.getPatientsStats);

router
  .route("/stats/doctors")
  .get(adminController.getDoctorsStats, handleFactory.getAll(Doctor));

module.exports = router;
