const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (res, req, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then((doc) => {
        console.log(doc);
        res.status(200).json({
            count: doc.length,
            orders: doc.map((doc) => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:300/orders/' + doc._id
                    }
                }
            })
        });

    }).catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
};

exports.orders_create_order = (res, req, next) => {
    Product
    .findById(req.body.productId)
    .populate('product')
    .then((product) => {
        console.log(product);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found!'
            });
        }
        const order = new Order ({
            _id: mongoose.Types.ObjectId(), 
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save();
    }).then((result) => {
        console.log(result);
        req.status(201).json({
            message: 'Order stored',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:300/orders/' + result._id
            }
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
};

exports.orders_get_order = (res, req, next) => {
    Order
    .findById(req.params.orderId)
    .exec()
    .then((order) => {
        if (!order) {
            console.log(order);
            return res.status(404).json({
                message: 'Order not found!'
            });
        }
        console.log(order);
        req.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:300/orders/' + result._id
            }
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
};

exports.orders_delete_order =  (res, req, next) => {
    Order
    .remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
        req.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'GET',
                url: 'http://localhost:300/orders/' + result._id
            }
        })
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
};