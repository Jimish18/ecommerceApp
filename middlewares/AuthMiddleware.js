const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Protected Routes token based

const requireSignIn = async (req,res,next) =>
{    
    try 
    {
        const decode = jwt.verify(req.headers.authorization , process.env.JWT_SECRET);    
        req.user = decode;
        next();
    } 
    catch (error) 
    {
        console.error(error);    
    }
}

//admin access
const isAdmin = async (req,res,next) =>
{
    try 
    {
        const user = await User.findById(req.user._id);
        if(user.role !== 1)
        {
            return res.status(401).json(
                {
                    success : false,
                    message : "Unauthorized Access"
                }
            )
        }    
        else
        {
            next();
        }
    } 
    catch (error) 
    {
        console.error(error);
        res.status(401).json(
            {
                success : false,
                error,
                message : "Error in admin middleware"
            }
        )
    }
}

module.exports = {requireSignIn , isAdmin};