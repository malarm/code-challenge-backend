const config = require('../config');
const { db } = require('../lib/database');
const pevino = require('../lib/pevino');

module.exports = {
  connect,
}

async function connect() {
  const collection = await db.collection('orders', {});
  module.exports.collection = collection
  const seedOrders = [160,161,162, 163, 164, 165];
  seedOrders.forEach(async order => {
    const initialOrder = await pevino.GetOrder(order);
    if(initialOrder[0]){
      const doc = initialOrder[0].Order_GetByIdResult
      await collection.insert({ ...doc , createdBy: 'API'})      
    }
  })  
}







