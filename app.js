const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./API/routes/products');
const ordersRoutes = require('./API/routes/orders');
const userRoutes = require('./API/routes/user');

mongoose.connect('mongodb+srv://DorelaSinjari:'+ process.env.MONGO_ATLAS_PW +'@cluster0.ywbi7.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useMongoClient: true
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
// MAKES THEUPLOADS FILE PUBLIC
app.use('/uploads', express.static('./uploads/'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    req.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Controll-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.header === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// CDO KERKESE ME /PRODUCTS SHKON NE FOLDERIN 
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/signup', userRoutes);

// HANDLEING ERRORS
app.use((res, req, next) => {
    const error = new Error('Not found');
    error.status = 404;
    // PASS FORWARDED ERROR REQUEST
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;