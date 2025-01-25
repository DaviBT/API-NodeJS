

'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-controller');
const authService = require('../services/auth-service');

// get
router.get('/', controller.get)
router.get('/:slug', controller.getBySlug)
router.get('/admin/:id', controller.getById)
router.get('/tags/:tag', controller.getByTag)

// post
router.post('/', authService.isAdmin, controller.post)

// put
router.put('/:id', authService.isAdmin, controller.put) 

// delete
router.delete('/', authService.isAdmin, controller.delete)

module.exports = router;
