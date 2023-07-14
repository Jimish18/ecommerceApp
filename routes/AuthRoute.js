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

// test routes with middleware Protextion
router.get('/test' ,requireSignIn, isAdmin ,testController)


// Protected route auth
router.get('/user-auth',requireSignIn , (req,res) =>
{
    res.status(200).json({ok : true});
})

module.exports = router;