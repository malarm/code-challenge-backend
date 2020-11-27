const Boom = require('@hapi/boom');
const compose = require('composable-middleware');

const authentication = require('./authentication');
const userModel = require('../../models/users').collection;

module.exports = {
	isAuthenticated,
};

// const expandUser = asyncHandler(_expandUser)

function isAuthenticated() {
	return compose()
		.use(authentication.authenticate) //Attaches the token payload as req.user
		.use(authentication.handleJwtError) //Handle express-jwt error if any.
		.use(_expandUser); //Replaces the token payload with a proper user object
}


/**
 * Replaces the user object with the one stored in arangodb
 */
function _expandUser(req, res, next) {
	if (!req.user || !req.user._id) {
		throw Boom.badRequest('Invalid user data. Confirm that user is configured properly', {
			data: {
				user: req.user,
			}
		});
	}

	userModel.get(req.user._id)
		.then((user) => {
			if (!user) {
				throw Boom.unauthorized('Auth failed. No such user found');
			}

			req.user = user;
			return next();
		})
		.catch((err) => {
			return next(err)
		});

}
