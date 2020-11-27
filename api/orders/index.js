const express = require('express');

const controller = require('./controller');

const router = express.Router();
const auth = require('../../lib/auth');

router.get('/', auth.isAuthenticated(), controller.findOrders);
router.get('/:id', auth.isAuthenticated(), controller.findOrderById);
router.put('/:id', auth.isAuthenticated(), controller.updateOrder);

module.exports = router;
