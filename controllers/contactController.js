const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get All Contacts
//@route GET /api/contacts
//@access private
const getAllContacts = asyncHandler(async (req, res) => {
	const contacts = await Contact.find({ user_id: req.user.id });
	res.status(200).json(contacts);
});

//@desc Get Specific Contact by Name
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
	try {
		const contact = await Contact.findById(req.params.id);
		res.status(200).json(contact);
	} catch (err) {
		res.status(404);
		throw new Error("Contact not found");
	}
});

//@desc Create a new Contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
	console.log(req.body);
	const { name, phone, email } = req.body;
	if (!name || !phone || !email) {
		res.status(400);
		throw new Error("All fields are mandatory");
	}

	const contact = await Contact.create({
		name,
		email,
		phone,
		user_id: req.user.id,
	});
	res.status(201).json(contact);
});

//@desc Update a Contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
	const contactExists = await Contact.findById(req.params.id);
	if (!contactExists) {
		res.status(404);
		throw new Error("Contact not found");
	}

	if (contactExists.user_id.toString() !== req.user.id) {
		res.status(403);
		throw new Error(
			"User does not have permissions to update another user's contacts"
		);
	}

	try {
		const contact = await Contact.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(200).json(contact);
	} catch (err) {
		res.status(404);
		throw new Error("Unable to update the contact");
	}
});

//@desc Delete a Contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
	const contactExists = await Contact.findById(req.params.id);
	if (!contactExists) {
		res.status(404);
		throw new Error("Contact not found");
	}

	if (contactExists.user_id.toString() !== req.user.id) {
		res.status(403);
		throw new Error(
			"User does not have permissions to delete another user's contacts"
		);
	}

	try {
		const contact = await Contact.findByIdAndDelete(req.params.id);
		if (!contact) {
			throw new Error("Contact does not exist");
		}
		res.status(200).json(contact);
	} catch (err) {
		res.status(404);
		throw new Error(
			`Unable to delete the contact with id: ${req.params.id}`
		);
	}
});

module.exports = {
	getAllContacts,
	getContact,
	createContact,
	updateContact,
	deleteContact,
};
