const express = require('express');
require('dotenv').config({});
const router = require('./routes.js');

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use('/', router);

const listen = () => {
	server.listen(process.env.PORT || 8181);
	console.info(`Server running on ${process.env.PORT || 8181}`);
};

listen();

// execOperations()
// 	.then((result) => {
// 		console.info('Mongodb connected!');
// 	})
// 	.catch((err) => {
// 		console.log(`MongoErr: ${err}`);
// 	});
