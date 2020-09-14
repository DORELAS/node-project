const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + this.file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// METHOD TYPE GET
// router.get('/', (res, req, next) => {
//     req.status(200).json({
//         message: `Succesfull GET request!`
//     });
// });

router.get('/', productController.get_all_products);
// METHOD TYPE POST
router.post('/', checkAuth, upload.single('productImage'), productController.post_all_products);

router.get('/:productId', productController.get_product);

router.patch('/:productId', checkAuth, productController.patch_product);

router.delete('/:productId', checkAuth, productController.delete_product);

module.exports = router;