const express = require('express');
const router = express.Router();
const { requireSignIn, isAdmin } = require('../middlewares/AuthMiddleware');
const {createCategoryController , updateCategoryController , getCategoriesController , getSingleCategoryController , deleteSingleCategoryController} = require('../controllers/CategoryController');

router.post('/create-category' , requireSignIn , isAdmin , createCategoryController);

router.put('/update-category/:id' , requireSignIn , isAdmin , updateCategoryController);

router.get('/categories' , getCategoriesController);

router.get('/single-category/:slug' , getSingleCategoryController);

router.delete('/delete-category/:id' , requireSignIn , isAdmin , deleteSingleCategoryController);

module.exports = router;