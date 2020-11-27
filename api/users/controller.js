const asyncHandler = require('express-async-handler')
const userModel = require("../../models/users");

module.exports = {
	findUsers: asyncHandler(findUsers),
};

async function findUsers(req, res) {
	const users = await userModel.collection.find();

	return res.status(200).json(users);
}
