module.exports = function(app) {
	// Api
	app.use('/api/*', function(req, res, next) {
		res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
		res.header('Pragma', 'no-cache');
		res.header('Expires', 0);
		return next();
	});

	app.use('/api/auth', require('./auth'));
	app.use('/api/health', require('./health'));
  app.use('/api/users', require('./users'));
  app.use('/api/orders', require('./orders'));
};
