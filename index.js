const http = require('http');

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const config = require('./config');
const database = require('./lib/database');
const pevino = require('./lib/pevino');
const errorHandler = require('./lib/error-handler');
const app = express();

async function start() {
	const morganFormat = `[:date[iso]] ":method :url" :status :res[content-length] ":referrer" ":user-agent"`;
	app.use(morgan(config.env === 'development' ? 'dev' : morganFormat));

	app.server = http.createServer(app);

	app.set('trust proxy', true);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	// Allow cors
	app.use(function(req, res, next) {
		if (req.headers.host.indexOf('www.') === 0) {
			const dest = config.siteUrl + req.path;
			return res.redirect(dest);
		}

		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, auth_token, X-CSRF-Token, Authorization');
		res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT, PATCH');
		res.set('Access-Control-Allow-Credentials', 'true');

		// intercept OPTIONS method
		if (req.method === 'OPTIONS') {
			return res.status(200).end();
		}

		next();
	});

	await pevino.connect()
	await database.connect()
	await require('./models').connect()

	require('./api')(app);
	app.use(errorHandler);

	return app;
}

start()
	.then((app) => {
		app.server.listen(config.port, function() {
			console.log('SERVER_STARTED - Server startup', { env: config.env, port: config.port });
		});
	})
	.catch((ex) => {
		console.error('Error booting server')
		throw ex;
	})
