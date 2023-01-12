const expect = require('chai').expect;
const sinon = require('sinon');

const router = require('../routes');
const { MongoClient } = require('mongodb');

describe('Login Controller', () => {
	sinon.stub(MongoClient, 'connect');
});
