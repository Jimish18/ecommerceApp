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

const getAllProductsController = async (req,res) =>
{
    try 
    {
        // Fetching all Products without photo field
        const products = await ProductModel
        .find({})
        .populate("category")
        .select('-photo')
        .limit(12)
        .sort({createdAt : -1});  

        
        res.status(200).json(
            {
                success : true,
                total : products.length,
                message : "Fetched All Products Successfully",
                products,
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
               success : false,
               message : "Error In Getting Product Details",
               error 
            }
        )   
    }
}

const getSingleProductsController = async (req, res) =>
{
    try 
    {
        const product = await ProductModel.findOne({slug : req.params.slug})
        .populate("category")
        .select('-photo');
        
        res.status(200).json(
            {
                success : true,
                message : "Fetched Single Product",
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
                message : "Error While Getting Single Product",
                error
            }
        )    
    }
}

const getProductsPhotoController = async (req,res) =>
{
    try 
    {
        const product = await ProductModel.findById(req.params.pid).select("photo");
        if(product.photo.data)
        {
            res.set('Content-Type' , product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
        
        
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success :false,
                message : "Error In getting Product Photo",
                error
            }
        )
    }
}

const deleteProductController = async (req,res) =>
{
    try 
    {
        const {id} = req.params;

        await ProductModel.findByIdAndDelete(id).select("-photo");

        res.status(200).json(
            {
                success : true,
                message : "Successfully Deleted Product",
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : "Error In Deleting Product",
                error
            }
        )    
    }
}

const updateProductController = async (req,res) =>
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
        const {id} = req.params;

        const product = await ProductModel.findByIdAndUpdate(id , 
            {
                ...req.fields , slug : slugify(name) 
            }, {new :true});
        
        if(photo)
        {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type
        }

        // await product.save();

        res.status(201).json(
            {
                success : true,
                message : "Product Updated successfully",
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
                message : "Error In Updating a Product",
                error
            }
        )    
    }
}

module.exports = {createProductController , getAllProductsController , getSingleProductsController , getProductsPhotoController , deleteProductController , updateProductController};