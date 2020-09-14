const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { token } = require('morgan');

exports.sign_up =  (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then((user) => {
            if(user.length >= 1) {
                return res.status(409).json({
                    message: 'User already exists!'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (error, hash) => {
                    if(!!error) {
                        return res.status(500).json({
                            error: error
                        });
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save().then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'User was successfully created!'
                            });
                        }).catch((error) => {
                            console.log(error);
                            res.status(500).json({
                                error: error
                            });
                        });
                    }
                });
            }
        });
};

exports.log_in = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if(user.length < 1) {
                return res.status(401).json({
                    message: 'Credentials doesn\'t match!'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (error, response) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Credentials doesn\'t match!'
                    });
                }
                if(response) {
                    // RESPOND A TOKEN TO THE LOGIN REQUEST
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, { expiresIn: '1h' });

                    return res.status(200).json({
                        message: 'Login succeded!',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Credentials doesn\'t match!'
                });
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
    };

exports.delete = (req, res, next) => {
    User.remove({_id: req.params.userID})
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'User deleted!'
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
    };

