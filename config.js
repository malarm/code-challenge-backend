const dotenv = require('dotenv')

dotenv.config()

module.exports = {
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || '8082',
	admin: {
		email: process.env.ADMIN_EMAIL,
		password: process.env.ADMIN_PASSWORD
	},
	pevino: {
		wsdl: process.env.PEVINO_WSDL,
		email: process.env.PEVINO_EMAIL,
		password: process.env.PEVINO_PASSWORD
	},
	sessionSecret: process.env.SESSION_SECRET
}
