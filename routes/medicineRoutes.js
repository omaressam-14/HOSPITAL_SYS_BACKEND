const router = require("express").Router();
const medicineController = require("../controllers/medicineController");
const authController = require("../controllers/authController");
const { uploadSinglePhoto, resizePhoto } = require("../utils/uploadImgs");

router.route("/:id").get(medicineController.getMedicine);


router
  .route("/")
  .get(medicineController.getAllMedicines)
  .post(
	authController.protect ,
	authController.restrictTo('nurse','admin'),
    uploadSinglePhoto,
    resizePhoto("medicines"),
    medicineController.createMedicine
  );
  
  
  
router.use(authController.protect, authController.restrictTo("admin" , "nurse"));

router
  .route("/:id")
  .patch(
    uploadSinglePhoto,
    resizePhoto("medicines"),
    medicineController.updateMedicine
  )
  .delete(medicineController.deleteMedicine);

module.exports = router;
