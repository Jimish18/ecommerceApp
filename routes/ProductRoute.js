const express = require('express');
const router = express.Router();
const { requireSignIn, isAdmin } = require('../middlewares/AuthMiddleware');
const {createProductController} = require('../controllers/ProductController');

router.post('/create-product' , requireSignIn , isAdmin , createProductController);


module.exports = router;