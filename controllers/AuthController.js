const { hashPassword , comparePassword} = require('../helpers/AuthHelper');
const User = require('../models/UserModel');
const OrderModel = require('../models/OrderModel');
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
        const {name , email , password , phone , address , answer} = req.body;    

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
        const user = new User({name , email , phone , address , answer ,password : hashedPassword}).save();

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
                            answer : user.answer,
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

const forgotPasswordController = async (req,res) =>
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});     
    }

    try 
    {
        const {email , answer , newPassword} = req.body;
        
        const user = await User.findOne({email,answer});

        if(!user)
        {
            return res.status(404).json(
                {
                    success : false,
                    message : "Wrong email or answer Entered"
                }
            )
        }

        const hashedPassword = await hashPassword(newPassword);

        await User.findByIdAndUpdate(user._id , {password : hashedPassword});

        res.status(200).json(
            {
                success : true,
                message : "Password Reset Successfully"
            }
        )
    } 
    catch (error) 
    {
       console.error(error);
       
       res.status(500).json(
        {
            success : false,
            message : "Something went wrong",
            error
        }
       )
    }
}

const updateProfileController = async (req,res) =>
{
    
    try 
    {
        const {name , address , password , phone } = req.body;          

        const user = await User.findById(req.user._id);

        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await User.findByIdAndUpdate(req.user._id , 
            {
                name : name || user.name,
                password : hashedPassword || user.password,
                phone : phone || user.phone,
                address : address || user.address
            }, {new : true});

        res.status(200).json(
            {
                success : true,
                message : "Profile Updated Successfully",
                updatedUser
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(400).json(
            {
                success : false,
                message : "Error while updating Profile",
                error
            }
        )    
    }
}

const getOrdersController = async(req,res) =>
{
    try 
    {
        const orders = await OrderModel
        .find({buyer: req.user._id})
        .populate("products","-photo")
        .populate("buyer","name");

        res.status(200).json(
            {
                success : true,
                message : 'Orders Fetched Successfully',
                orders
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : 'Error while fetching Orders',
                error
            }
        )    
    }
}

const getAllOrdersController = async(req,res) =>
{
    try 
    {
        const orders = await OrderModel
        .find({})
        .populate("products","-photo")
        .populate("buyer","name")
        .sort({createdAt : '-1'});

        res.status(200).json(
            {
                success : true,
                message : 'Orders Fetched Successfully',
                orders
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : 'Error while fetching Orders',
                error
            }
        )    
    }
}

const updateOrderStatusController = async(req,res) =>
{
    try 
    {
        const {orderId} = req.params;
        const {status} = req.body;

        const orders = await OrderModel.findByIdAndUpdate(orderId , 
            {
                status
            },
            {
                new : true
            })

        res.status(200).json(
            {
                success : true,
                message : "Successfully Updated Order status",
                orders 
            }
        )

    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : "Error While updating order status",
                error
            }
        )    
    }
}

module.exports = 
{
    registerController , 
    loginController , 
    forgotPasswordController ,
    testController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    updateOrderStatusController
};

