const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/orders');
const checkAuth = require('../middleware/check-auth');

// METHOD TYPE GET
router.get('/', checkAuth, ordersController.orders_get_all);

// METHOD TYPE POST
router.post('/', checkAuth, ordersController.orders_create_order);

router.get('/:orederId', checkAuth, ordersController.orders_get_order);

// router.put('/:orederId', checkAuth, (res, req, next) => {
//     req.status(200).json({
//         message: `Oreders details`,
//         id: res.params.orderId
//     });
// });

// router.post('/:orederId', (res, req, next) => {
//     req.status(201).json({
//         message: `Oreders details`,
//         id: res.params.orderId
//     });
// });

router.delete('/:orederId', checkAuth, ordersController.orders_delete_order);

module.exports = router;