const expect = require('chai').expect;
const sinon = require('sinon');

const { MongoClient } = require('mongodb');
const { it, describe } = require('mocha');
const { mongoCredentials } = require('../controllers');

describe('Login Controller', () => {
	const stubValue = {
		username: '2828399393933',
		password: '92828',
	};
	it('should throw an error if accessing the database fails', async () => {
		const stub = sinon
			.stub(MongoClient, 'connect')
			.callsFake(mongoCredentials.url, mongoCredentials.options);
		const db = stub.db(mongoCredentials.dbName);
		const result = await db
			.collections('sellers')
			.findOne({ seller_id: stubValue.username });
		expect(result).true();
	});
});
