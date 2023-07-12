const express = require('express');
const router = express.Router();
const {registerController , loginController , testController} = require('../controllers/AuthController');
const {body} = require('express-validator');
const { requireSignIn, isAdmin } = require('../middlewares/AuthMiddleware');


// Register API  || POST Method
router.post('/register', 
body('email','Invalid Email').isEmail(),
body('name','Too Short Name').isLength({min:5}),
body('password','Password is too weak').isLength({min:8}),
body('phone' , 'Invalid Phone Number Entered').isLength({min : 10 , max : 10}) 
, registerController)

// Login API || POST Method
router.post('/login', 
body('email','Invalid Email').isEmail(),
body('password','Password is too weak').isLength({min:8})
, loginController)

router.get('/test' ,requireSignIn, isAdmin ,testController)


module.exports = router;