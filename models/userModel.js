const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Please add your username"],
		},

		email: {
			type: String,
			required: [true, "Please add a valid email address"],
			unique: [true, "Email address is already in-use"],
		},

		password: {
			type: String,
			required: [true, "Please input your password"],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", userSchema);
