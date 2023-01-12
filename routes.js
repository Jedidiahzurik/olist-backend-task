const { Router } = require('express');
const {
	loginController,
	getOrders,
	deleteOrder,
	updateAccount,
} = require('./controllers');
const { validateAcc } = require('./auth');

const router = Router();

router.post('/login', loginController);

router.get('/order_items', validateAcc, getOrders);

router.delete('/order_items/:id', validateAcc, deleteOrder);

router.patch('/account', validateAcc, updateAccount);

module.exports = router;
