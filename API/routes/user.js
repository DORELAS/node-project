const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', userController.sign_up);

// USER LOGIN 
router.post('/login', userController.log_in);

router.delete('/:userID', checkAuth, userController.delete);

module.exports = router;