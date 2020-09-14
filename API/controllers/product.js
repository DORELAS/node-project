const mongoose = require('mongoose');
const Products = require('../models/product');

exports.get_all_products =  (res, req, next) => {
    Products.find()
    .select('name price _id')
    .exec()
    .then((doc) => {
        console.log(doc);
        const response = {
            count: doc.length,
            products: doc.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:300/products/' + doc._id
                    }
                }
            })
        };
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.stale(404).json({ message: 'Product not found!'});
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).json(error);
    });
};

exports.post_all_products = (req, res, next) => {
    console.log(req.file);
    const product = new Products({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    // SAVES PRODUCT INTO MONGOOSE 
    product.save()
    .then((result) => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully!',
            createProduct:{
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:300/products' + result._id
                }
            }
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });

    res.status(201).json({
        message: `Succesfull POST request!`,
        createdProduct: product
    });
};

exports.get_product =  (res, req, next) => {
    const id = res.params.productId;
    // if (id === 'special') {
    //     req.status(200).json({
    //         message: `You discovered the special ID!`,
    //         id: id
    //     });
    // } else {
    //     res.stale(200).json({
    //         message: `You discovered an ID!`,
    //     });
    // }

    Products.findById(id).exec().then((response) => {
        console.log(response);
        if (response) {
            response.status(200).json({
                product: response,
                request: {
                    type: 'GET',
                    description: 'GET_ALL_PROD',
                    url: 'http://localhost:300/products'
                }
            });
        } else {
            response.status(404).json({
                message: 'Product not found!'
            });
        }
        
    }).catch((error) => {
        console.log(error);
        res.status(500).json({error: error});
    });
};

exports.patch_product =  (res, req, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for (const options of req.body) {
        updateOps[options.propName] = options.value;
    }
    // if (id === 'special') {
    //     req.status(200).json({
    //         message: `You added the special ID!`,
    //         id: id
    //     });
    // } else {
    //     res.stale(200).json({
    //         message: `You entered an ID!`,
    //     });
    // }
    Products.update({ _id: id }, { $set: updateOps }).exec().then((res) => {
        console.log(res);
        res.status(200).json({
            product: res,
            message: 'Product Updated successfully!'
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({ error: error });
    });

};

exports.delete_product = (res, req, next) => {
    const id = req.params.productId;
    // if (id === 'special') {
    //     req.status(200).json({
    //         message: `You deleted the special ID!`,
    //         id: id
    //     });
    // } else {
    //     res.stale(200).json({
    //         message: `You deleted an ID!`,
    //     });
    // }
    Products.remove({_id: id}).exec().then((result) => {
        console.log(result);
        res.status(200).json({
            message: 'Product deleted',
            product: result
        });
    }).catch((error) => {
        console.log(error);
        res.status(500).json({error: error});
    });
};