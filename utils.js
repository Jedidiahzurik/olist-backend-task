const { sign, verify } = require('jsonwebtoken');
require('dotenv').config({});

const jwtSecret = process.env.JWT_SECRET || randomjwtsecrejustfortestpurpose;

/**
 *
 * @param {string} seller_id
 * @param {Date} expiryDuration
 * @returns {string} jwt string
 */
exports.createJwtToken = (seller_id, expiryDuration) => {
	const payload = {
		sub: seller_id,
	};
	return sign(payload, jwtSecret, {
		algorithm: 'HS512',
		expiresIn: expiryDuration,
	});
};

exports.verify = (token) => {
	const payload = verify(token, jwtSecret);
	return payload;
};
