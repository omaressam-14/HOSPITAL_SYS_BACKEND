const router = require("express").Router({ mergeParams: true });
const medicalRecordController = require("../controllers/medicalRecordController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(
    authController.protect,
    medicalRecordController.getAllMedicalRecords
  )
  .post(
    authController.protect,
    authController.restrictTo("doctor"),
    //medicalRecordController.getDoctorPatient,
    medicalRecordController.createMedicalRecord
  );

router.route("/all").get(medicalRecordController.getAllUserMedicalRecords);



router.route("/:id").get(medicalRecordController.getMedicalRecord);


router.use(
  authController.protect,
  authController.restrictTo("admin", "doctor")
);
  
  router.route("/:id")
  .patch(medicalRecordController.updateMedicalRecord)
  .delete(medicalRecordController.deleteMedicalRecord);

module.exports = router;
