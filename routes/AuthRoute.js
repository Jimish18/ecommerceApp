const express = require('express');
const router = express.Router();
const 
{
    registerController , 
    loginController , 
    forgotPasswordController , 
    testController,
    updateProfileController

} = require('../controllers/AuthController');
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

router.post('/forgot-password', 
body('email','Invalid Email').isEmail(),
body('answer','answer is required').isLength({min:1}),
body('newPassword','newPassword is too weak').isLength({min:8})
, forgotPasswordController)

// test routes with middleware Protextion
router.get('/test' ,requireSignIn, isAdmin ,testController)


// Protected user route auth
router.get('/user-auth',requireSignIn , (req,res) =>
{
    res.status(200).json({ok : true});
})

// Protected admin route auth
router.get('/admin-auth',requireSignIn, isAdmin, (req,res) =>
{
    res.status(200).json({ok : true});
})

router.put('/profile', 
body('newPassword','newPassword is too weak').isLength({min:8})
, requireSignIn ,updateProfileController)

module.exports = router;