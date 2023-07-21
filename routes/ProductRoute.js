const express = require('express');
const router = express.Router();
const { requireSignIn, isAdmin } = require('../middlewares/AuthMiddleware');
const 
{   createProductController , 
    getAllProductsController , 
    getSingleProductsController , 
    getProductsPhotoController , 
    deleteProductController , 
    updateProductController , 
    getFiltersProductController , 
    getRelatedProductsController,
    getCategoryWiseProductsController,
    braintreeTokenController,
    braintreePaymentsController

} = require('../controllers/ProductController');
const formidable = require('express-formidable');

router.post('/create-product' , requireSignIn , isAdmin , formidable(), createProductController);

router.get('/get-products' ,  getAllProductsController);

router.get('/get-product/:slug' ,  getSingleProductsController);

router.get('/product-photo/:pid' ,  getProductsPhotoController);

router.delete('/delete-product/:id' , requireSignIn , isAdmin , deleteProductController);

router.put('/update-product/:id' , requireSignIn , isAdmin , formidable(), updateProductController);

router.post('/product-filters' , getFiltersProductController);

router.get('/related-product/:pid/:cid' , getRelatedProductsController);

router.get('/product-category/:slug' , getCategoryWiseProductsController);

// payments Route

// token
router.get('/braintree/token' , braintreeTokenController);

// payments
router.post('/braintree/payment' , requireSignIn , braintreePaymentsController);

module.exports = router;