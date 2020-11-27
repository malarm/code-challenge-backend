'use strict';

const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const SecurePassword = require('secure-password');

const config = require('../../config');

const securePassword = SecurePassword();
const validateJwt = expressJwt({ secret: Buffer.from(config.sessionSecret, 'base64'), algorithms: ['HS256'] });

module.exports = {
	authenticate,
	handleJwtError,
	signToken,
	validatePassword,
	hashPassword,
	securePassword,
};

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function authenticate(req, res, next) {
	// allow access_token to be passed through query parameter as well
	// eslint-disable-next-line no-prototype-builtins
	if (req.query && req.query.hasOwnProperty('access_token')) {
		req.headers.authorization = 'Bearer ' + req.query.access_token;
	}

	if (!req.headers.authorization) {
		return res.status(401).json({ error: 'No authorization token was found' });
	}

	validateJwt(req, res, next);
}

function handleJwtError(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		if (err.inner.name === 'TokenExpiredError') {
			return res.status(err.status).json(err.inner);
		}

		return res.status(err.status).json(err);
	}

	next();
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(payload, customSecret, customProperties) {
	const secret = customSecret || config.secrets.session;
	const properties = { expiresIn: '7d' };

	if (customProperties) {
		Object.assign(properties, customProperties);
	}

	return jwt.sign(payload, Buffer.from(secret, 'base64'), properties);
}

function validatePassword(plainTextPassword, hashedPassword) {
	if (!Buffer.isBuffer(plainTextPassword)) {
		plainTextPassword = Buffer.from(plainTextPassword);
	}
	if (!Buffer.isBuffer(hashedPassword)) {
		hashedPassword = Buffer.from(hashedPassword);
	}

	return new Promise((resolve, reject) => {
		//Check if password is a legacy password
		if (hashedPassword.length !== SecurePassword.HASH_BYTES) {
			console.warn('Buffer length does not match expected input. Asking user to reset password');
			reject(Boom.unauthorized('Invalid password. Please reset your password'));
		}

		securePassword.verify(plainTextPassword, hashedPassword, function(err, enumStatus) {
			if (err) {
				reject(err);
			}

			if (enumStatus === SecurePassword.NEEDS_REHASH) {
				console.warn('Password needs rehash. Asking user to reset password.');
				reject(Boom.unauthorized('Invalid password. Please reset your password'));
			}

			if (enumStatus === SecurePassword.INVALID) {
				console.warn('Password is invalid');
				reject(Boom.unauthorized('Invalid password'));
			}

			if (enumStatus === SecurePassword.VALID) {
				resolve();
			}
		});
	});
}

/**
 * Hash password with 'secure-password' module.
 * @param {String | Buffer} password
 */
function hashPassword(password) {
	if (!Buffer.isBuffer(password)) {
		password = Buffer.from(password);
	}

	return new Promise((resolve, reject) => {
		securePassword.hash(password, function(err, hashedPassword) {
			if (err) reject(err);

			resolve(hashedPassword.toString());
		});
	});
}
