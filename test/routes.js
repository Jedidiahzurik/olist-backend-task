const expect = require('chai').expect;
const sinon = require('sinon');

const router = require('../routes');
const { MongoClient } = require('mongodb');
const { it } = require('mocha');

describe('Login Controller', () => {
	it('should throw an error if accessing the database fails', () => {
		sinon.stub(MongoClient, 'connect');
		MongoClient.connect().throws();
	});
});
