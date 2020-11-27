module.exports = {
	health,
};

async function health(req, res) {
	return res.status(200).json({ status: 200, message: 'iamok' });
}
