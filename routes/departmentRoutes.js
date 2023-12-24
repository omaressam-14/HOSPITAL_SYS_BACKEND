const router = require("express").Router();
const departmentController = require("../controllers/departmentController");
const authController = require("../controllers/authController");

router.route("/").get(departmentController.getAllDepartments);
router.route("/:id").get(departmentController.getDepartment);

router.use(authController.protect, authController.restrictTo("admin"));
router.route("/").post(departmentController.createDepartment);
router
  .route("/:id")
  .delete(departmentController.deleteDepartment)
  .patch(departmentController.updateDepartment);

module.exports = router;
