require('dotenv').config({});
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://';

exports.connectToCluster = async (uri) => {
	let mongoClient;

	try {
		mongoClient = new MongoClient(uri);
		await mongoClient.connect();
	} catch (e) {
		console.log('Failure while connecting to mongodb atlas' + e);
		process.exit();
	}
};

exports.execOperations = async () => {
	let mongoClient;

	try {
		mongoClient = await this.connectToCluster(uri);
		const db = mongoClient.db('olist');
		const orderCollection = db.collection('order');
		// call the route function here and oass the collection as param
	} catch {
		(err) => {
			console.log(`MongoErr: ${err}`);
		};
	}
};
