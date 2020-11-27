const Boom = require('@hapi/boom');
const get = require('lodash/get');

module.exports = function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		const boomError = Boom.isBoom(err) ? { error: err } : { error: 'Thrown error was not Boom' };
		console.error('Error was thrown AFTER response was sent', boomError);
		return next(err);
	}

	if (!Boom.isBoom(err)) {
		console.error('Non boom error received', '\n', err);
		res.status(500).json({
			status: 500,
			message: 'Unkown error encountered',
		});
		return;
	}

	const output = err.output;

	// Check if err.data.public exists
	if (get(err, 'data.public')) {
		output.payload.data = err.data.public;
	}

	if (err.message) {
		output.payload.message = err.message;
	}

	const logLevel = output.statusCode >= 500 ? 'error' : 'warn';
	console[logLevel](output.payload.message, '\n', {
		data: err.data,
		error: output,
	}, '\n', err);

	res.status(output.statusCode).json(output.payload);
};
