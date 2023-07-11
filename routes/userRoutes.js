const express = require("express");
const {
	loginUser,
	registerUser,
	currentUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validTokenHandler");
const router = express.Router();

router.route("/login").post(loginUser);

router.route("/register").post(registerUser);

router.get("/current", validateToken, currentUser);

module.exports = router;
