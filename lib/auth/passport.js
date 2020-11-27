
const Boom = require('@hapi/boom');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../../models/users').collection;
const authentication = require('./authentication');

const fields = {
	usernameField: 'email',
	passwordField: 'password'
};

const localStrategy = new LocalStrategy(fields, (email, password, done) => {
	const query = { email: email.toLowerCase().trim() };

	userModel.find(query)
		.then((users) => {
			if (!users || !users[0]) {
				return done(Boom.unauthorized('This email is not registered', JSON.stringify({ data: { email: email } })));
			}

			const user = users[0];

			if (user.state === 'disabled') {
				return done(Boom.unauthorized('Auth failed. User has been disabled, and is therefore not valid any more', {
					data: {
						user: user._id,
					}
				}));
			}

			if (user.state === 'pending' || user.state === 'created' || !user.hashedPassword) {
				return done(Boom.unauthorized('User has not been verified. Please contact support if you belive this is an error', {
					data: {
						user: user._id,
					}
				}));
			}

			authentication.validatePassword(password, user.hashedPassword)
				.then(() => {
					const filteredUser = { ...user };
					delete filteredUser.hashedPassword;

					done(null, filteredUser);
				})
				.catch(err => {
					done(Boom.unauthorized(err.message));
				});
		})
		.catch((error) => {
			throw Boom.boomify(error, { message: 'Error while getting user' });
		});
});

function PromisedAuthenticate(req, res, next) {
	return new Promise((resolve, reject) => {
		passport.authenticate(
			'local',
			(err, user) => {
				if (err) reject(Boom.boomify(err));
				if (!user) reject(Boom.unauthorized());
				resolve(user);
			})(req, res, next);
	});
}

passport.use(localStrategy);

module.exports = {
	...passport,
	PromisedAuthenticate,
};
