const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { createJwtToken } = require('./utils');

require('dotenv').config({});

const atlas_url =
	'mongodb+srv://uty:user1uty@cluster0.hswbirn.mongodb.net/readers?retryWrites=true&w=majority';

const mongoCredentials = {
	url: process.env.MONGODB_URI || atlas_url,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	dbName: 'readers',
};

exports.loginController = async (req, res) => {
	const { body } = req;

	MongoClient.connect(
		mongoCredentials.url,
		mongoCredentials.options,
		async (err, client) => {
			try {
				if (err) throw err;
				let db = client.db(mongoCredentials.dbName);
				// seller_id as username and seller_zip_code_prefix as password
				const result = await db
					.collection('sellers')
					.findOne({ seller_id: body.username });
				client.close();

				if (!result)
					return res
						.status(400)
						.json({ msg: 'user does not exist, confirm your details' });

				// the + before body.password converts the password form string to number as stored in the database
				if (+body.password !== +result.seller_zip_code_prefix)
					return res.status(400).json({ msg: 'password does not match user' });
				const token = createJwtToken(result.seller_id, '2h');
				res.status(200).json({ token });
			} catch (e) {
				res.status(500).send(e.message);
			}
		}
	);
};

exports.getOrders = async (req, res) => {
	const { offset, limit } = req.query;
	const { userId } = req;

	MongoClient.connect(
		mongoCredentials.url,
		mongoCredentials.options,
		async (err, client) => {
			try {
				if (err) throw err;

				let data = [];
				let db = client.db(mongoCredentials.dbName);
				const currentPage = offset || 1;
				const skip = (+currentPage - 1) * 20;
				const totalPages = await db.collection('orders').countDocuments();
				const cursor = await db.collection('orders').aggregate([
					{ $match: { seller_id: userId } },
					// select needed fileds
					{
						$project: {
							order_id: 1,
							product_id: 1,
							seller_id: 1,
							shipping_limit_date: 1,
							price: 1,
						},
					},
					// {
					// 	$group: {
					// 		_id: '$order_id',
					// 		product_id: { $last: '$product_id' },
					// 		seller_id: { $last: '$seller_id' },
					// 		shipping_limit_date: { $last: '$shipping_limit_date' },
					// 		price: { $last: '$price' },
					// 	},
					// },
					// pahgination
					{
						$skip: skip,
					},
					{
						$limit: +limit || 20,
					},
					// join orders and products
					{
						$lookup: {
							from: 'products',
							localField: 'product_id',
							foreignField: 'product_id',
							as: 'product_data',
						},
					},
					// unwind the array of product_data
					{ $unwind: '$product_data' },
				]);

				await cursor.forEach((doc) => {
					data.push(doc);
				});
				let d = [];
				for (let index = 0; index < data.length; index++) {
					d.push({
						id: data[index]._id,
						price: data[index].price,
						date: data[index].shipping_limit_date,
						product_id: data[index].product_data.product_id,
						product_category: data[index].product_data.product_category_name,
					});
				}

				res.status(200).json({
					data: d,
					total: totalPages,
					limit,
					offset: skip,
				});
				cursor.close();
			} catch (e) {
				res.status(500).send(e.message);
			}
		}
	);
};

exports.deleteOrder = async (req, res) => {
	MongoClient.connect(
		mongoCredentials.url,
		mongoCredentials.options,
		async (err, client) => {
			try {
				if (err) throw err;
				let db = client.db(mongoCredentials.dbName);
				const _id = ObjectId.createFromHexString(req.params.id);

				const result = await db.collection('orders').deleteOne({ _id: _id });
				if (result.deletedCount === 0)
					return res.status(404).json({
						msg: 'cannnot delete item, item does not exist in the database',
					});
				res.status(200).json({ msg: 'deleted item ' + req.params.id });
				client.close();
			} catch (e) {
				res.status(500).send(e.message);
			}
		}
	);
};

exports.updateAccount = async (req, res) => {
	const { body, userId } = req;
	MongoClient.connect(
		mongoCredentials.url,
		mongoCredentials.options,
		async (err, client) => {
			try {
				if (err) throw err;

				let db = client.db(mongoCredentials.dbName);
				data = {};
				if (body.state && body.city) {
					data = {
						$set: { seller_city: body.city, seller_state: body.state },
					};
				} else if (body.state) {
					data = { $set: { seller_state: body.state } };
				} else if (body.city) {
					data = {
						$set: { seller_city: body.city, seller_state: body.state },
					};
				} else {
					return res.status(400).json({
						msg: 'user can only update city and state values',
					});
				}

				const result = await db
					.collection('sellers')
					.findOneAndUpdate({ seller_id: userId }, data, {
						returnDocument: true,
					});

				if (!result) return res.status(500).json({ msg: 'cannot update data' });
				res.status(200).json({
					data: {
						state: result.value.seller_state,
						city: result.value.seller_city,
					},
				});
				client.close();
			} catch (e) {
				res.status(500).send(e.message);
			}
		}
	);
};
