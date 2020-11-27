const asyncHandler = require('express-async-handler')

const authentication = require('../../lib/auth/authentication');
const passport = require('../../lib/auth/passport');
const config = require('../../config');

module.exports = {
	authenticate: asyncHandler(authenticate),
};

async function authenticate(req, res, next) {
	if (!req.body.email) {
		return res.status(400).json({ message: 'Missing email' })
	}
	if (!req.body.password) {
		return res.status(400).json({ message: 'Missing password' })
	}

	const user = await passport.PromisedAuthenticate(req, res, next)
	const token = authentication.signToken({ _id: user._id, }, config.sessionSecret, { expiresIn: '7d' });

	return res.status(200).json({ token: token });
}
