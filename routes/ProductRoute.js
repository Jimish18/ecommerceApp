const express = require('express');
const router = express.Router();
const { requireSignIn, isAdmin } = require('../middlewares/AuthMiddleware');
const {createProductController , getProductController} = require('../controllers/ProductController');
const formidable = require('express-formidable');

router.post('/create-product' , requireSignIn , isAdmin , formidable(), createProductController);

router.post('/get-product' ,  getProductController);


module.exports = router;