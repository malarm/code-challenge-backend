const TyrDB = require('tyrdb');
const { MemoryAdapter, FsAdapter } = require('tyrdb/adapters')

const adapter = new MemoryAdapter();
//const adapter = new FsAdapter();
const client = new TyrDB({adapter});

module.exports = {
	connect,
}

async function connect() {
	await client.connect();
	const db = await client.db('wineandbarrels');
	module.exports.db = db
}
