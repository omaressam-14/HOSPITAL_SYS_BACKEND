const router = require("express").Router();
const contactusController = require("../controllers/contactusController");

router.route("/").post(contactusController.sendEmailToAdmin);

module.exports = router;
