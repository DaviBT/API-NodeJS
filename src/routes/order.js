
'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/order-controller');
const authService = require('../services/auth-service');


// get
router.get('/', authService.authorize, controller.get)

// post
router.post('/', authService.authorize, controller.post)

module.exports = router;