const asyncHandler = require('express-async-handler')
const orderModel = require("../../models/orders");

module.exports = {
  findOrders: asyncHandler(findOrders),
  findOrderById: asyncHandler(findOrderById),
  updateOrder: asyncHandler(updateOrder),
};

async function findOrders(req, res) {
  //Bug in db package in find() if no selector is provided
	const orders = await orderModel.collection.find({ createdBy: 'API'});
	return res.status(200).json(orders);
}

async function findOrderById(req, res){
  const { params } = req;  
  const order = await orderModel.collection.get(params.id);
  return res.status(200).json(order);
}

async function updateOrder(req, res){
  const { params, body } = req;
  const updatedOrder = await orderModel.collection.replace(body);
  return res.status(200).json(updatedOrder);
}
