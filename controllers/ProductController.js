const  slugify  = require('slugify');
const ProductModel = require('../models/ProductModel');
const fs = require('fs');

const createProductController = async (req,res) =>
{
    try 
    {
        const {name ,  description , price , category , quantity , shipping} = req.fields ; 
        const {photo} = req.files;

        switch (true) {
            case !name:
                return res.status(500).json({error : 'Name is Required'});
            case !description:
                return res.status(500).json({error : 'description is Required'});
            case !price:
                return res.status(500).json({error : 'price is Required'});    
            case !category:
                return res.status(500).json({error : 'category is Required'});
            case !quantity:
                return res.status(500).json({error : 'quantity is Required'});
            case !photo || photo.size > 1000000:
                return res.status(500).json({error : 'photo is Required and size should be less than 1mb'});       
            
        }

        const product = new ProductModel({...req.fields , slug : slugify(name)});
        
        if(photo)
        {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type
        }

        await product.save();

        res.status(201).json(
            {
                success : true,
                message : "Product created successfully",
                product
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : "Error In Creating a Product",
                error
            }
        )    
    }
};

const getProductController = async (req,res) =>
{

}

module.exports = {createProductController , getProductController};