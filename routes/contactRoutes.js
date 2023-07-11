const express = require("express");
const router = express.Router();
const {
	createContact,
	deleteContact,
	getContact,
	getAllContacts,
	updateContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validTokenHandler");

// You can also combine methods if they have the same route
// router.route("/").get(getContact).post(createContact);
router.use(validateToken);

router.route("/").get(getAllContacts);

router.route("/").post(createContact);

router.route("/:id").get(getContact);

router.route("/:id").put(updateContact);

router.route("/:id").delete(deleteContact);

module.exports = router;
