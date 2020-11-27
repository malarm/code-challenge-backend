const express = require('express');

const controller = require('./controller');

const router = express.Router();
const auth = require('../../lib/auth');

router.get('/', auth.isAuthenticated(), controller.findUsers);

module.exports = router;
