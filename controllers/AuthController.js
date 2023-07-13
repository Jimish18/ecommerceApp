const { hashPassword , comparePassword} = require('../helpers/AuthHelper');
const User = require('../models/UserModel');
const {validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const registerController = async (req , res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});     
    }

    try 
    {
        const {name , email , password , phone , address} = req.body;    

        // existing User Check
        const existingUser = await User.findOne({email});

        if(existingUser)
        {
            return res.status(200).json(
                {
                    success : true,
                    message : 'Already Registered ! Please Login.'
                }
            )
        }

        // register User
        const hashedPassword = await hashPassword(password);

        // save()
        const user = new User({name , email , phone , address , password : hashedPassword}).save();

        res.status(201).json(
            {
                success : true,
                message : 'User Registered Successfully'
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).send(
            {
                success : false,
                message : 'Error in Registration'
            }
        )    
    }
};

const loginController = async (req , res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});     
    }

    try 
    {
        const {email , password} = req.body;

        const user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json(
                {
                    success : false,
                    message : "Invalid Credentials Entered ! Please Try Again."
                }
            )
        }
        else
        {
            const compPassword = await comparePassword(password, user.password);
            
            if(compPassword)
            {
                const token = await jwt.sign({_id : user._id} , process.env.JWT_SECRET , {expiresIn : "7d"});
                

                res.status(200).json(
                    {
                        success : true,
                        message : "User Logged In Successfully",
                        User : 
                        {
                            _id : user._id,
                            name : user.name,
                            email : user.email,
                            phone : user.phone,
                            address : user.address,
                            role : user.role
                        },
                        token
                    }
                )
            }
            else
            {
                return res.status(400).json(
                    {
                        success : false,
                        message : "Invalid Credentials Entered ! Please Try Again."
                    }
                )
            }
        }
        
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : "Invalid Credentials Entered"
            }
        )
    }
}

const testController = (req,res) =>
{
    res.json(
        {
            message : "Protected Routes"
        }
    )
}

module.exports = {registerController , loginController , testController};

