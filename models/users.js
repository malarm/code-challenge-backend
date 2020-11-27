const config = require('../config');
const { db } = require('../lib/database');
const { hashPassword } = require('../lib/auth/authentication');

module.exports = {
  connect,
}

async function connect() {
  const collection = await db.collection('users', {});
  module.exports.collection = collection
  await seed(collection)
}

/**
 * Ensure admin user is created on boot
 * This is only neccesary because we are using a ephemeral in-memory database
 */
async function seed(col) {
  const hashedPassword = await hashPassword(config.admin.password)

  const user = {
    email: config.admin.email,
    hashedPassword: hashedPassword,
  }

  await col.insert(user)
}