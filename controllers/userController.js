const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc Login with User Info
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error("All fields are mandatory");
	}

	const user = await User.findOne({ email });
	if (user && (await bcrypt.compare(password, user.password))) {
		const accessToken = jwt.sign(
			{
				user: {
					username: user.username,
					email: user.email,
					id: user.id,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "15m" }
		);
		res.status(200).json({ accessToken });
	} else {
		res.status(401);
		throw new Error("The email or password is not valid");
	}
});

//@desc Register a new User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		res.status(400);
		throw new Error("All fields must be valid");
	}
	// Check if user already exists with provided email
	const userAvailable = await User.findOne({ email });
	if (userAvailable) {
		res.status(400);
		throw new Error(`Email Address: ${email} is already in use`);
	}

	// Hash Password using Bcrypt
	const hashedPassword = await bcrypt.hash(password, 10);
	console.log(hashedPassword);

	const user = await User.create({
		username,
		email,
		password: hashedPassword,
	});

	if (user) {
		res.status(201).json({ _id: user.id, email: user.email });
	} else {
		res.status(400);
		throw new Error("User data provided is not valid");
	}

	res.json({ message: "Register Successful" });
});

//@desc Access current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
	res.json(req.user);
});

module.exports = { currentUser, loginUser, registerUser };
