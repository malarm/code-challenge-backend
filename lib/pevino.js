const request = require('request');
const soap = require('soap');
const _lodash = require('lodash');

const config = require('../config');

let client

module.exports = {
	connect,
	GetOrder
}

const orderFields = [
  'Id', 'Status', 'CustomerComment','DateDelivered', 'DateSent', 'DateUpdated', 'DateDue', 'DeliveryTime', 'DeliveryComment',
  'InvoiceNumber','OrderComment','OrderLines','Origin','ReferenceNumber','Site', 'Total','TrackingCode',
]

async function connect() {
	client = await soap.createClientAsync(config.pevino.wsdl, {
		request: request.defaults({ jar: true })
	});

	await client.Solution_ConnectAsync({ Username: config.pevino.email, Password: config.pevino.password })
	await client.Solution_SetLanguageAsync({ LanguageISO: 'DK' })

	// Must manually specify wanted fields based on https://api.hostedshop.dk/doc/Hosted%20Solution%20API/Order.html
	await client.Order_SetFieldsAsync({ Fields: _lodash.join(orderFields,',') })
}

async function GetOrder(id) {
	return await client.Order_GetByIdAsync({ OrderId: id })
}
