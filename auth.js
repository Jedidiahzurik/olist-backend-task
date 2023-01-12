const { verify } = require('./utils');

exports.validateAcc = async (req, res, next) => {
	const token = req.headers['x-auth-token'];

	if (!token) return res.status(403).send('provide a valid token header');

	if (typeof token !== 'string')
		return res.status(403).send('provide a valid token type');

	try {
		const payload = verify(token);
		req.userId = payload.sub.toString();
		next();
	} catch (e) {
		res.status(500).send(e.message);
	}
};
