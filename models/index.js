const usersModel = require('./users')
const ordersModel = require('./orders')

module.exports = {
  connect: async () => {
    await usersModel.connect()
    await ordersModel.connect()
  },
  usersModel,
}