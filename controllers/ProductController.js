const  slugify  = require('slugify');
const ProductModel = require('../models/ProductModel');
const CategoryModel = require('../models/CategoryModel');
const OrderModel = require('../models/OrderModel');
const fs = require('fs');
const braintree = require("braintree");

// Payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController = async (req,res) =>
{
    try 
    {
        const {name ,  description , price , category , quantity , shipping} = req.fields ; 
        const {photo} = req.files;
        // const {photo} = req.fields;

        

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
            case !photo || photo.size > 100000000:
                return res.status(500).json({error : 'photo is Required and size should be less than 1mb'});       
            default :
                break;
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
        // .limit(12)
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
            // case !photo || photo.size > 100000000:
            //     return res.status(500).json({error : 'photo is Required and size should be less than 1mb'});       
            default :
                break;
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

        await product.save();

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

// filtered Product Controller

const getFiltersProductController = async (req,res) =>
{
    try 
    {
        const {checked , radio} = req.body;

        let args = {};

        if(checked.length > 0) args.category = checked;
        if(radio.length) args.price = {$gte : radio[0] , $lte : radio[1]}

        const products = await ProductModel.find(args);

        if(products)
        {
            res.status(200).json(
                {
                    success : true,
                    products
                }
            )
        }
    } 
    catch (error)
    {
        console.error(error);
        res.status(400).json(
            {
                success : false,
                message : "Error While filtering Products",
                error
            }
        )
    }
}

const getRelatedProductsController = async (req,res) =>
{
    try 
    {
        const {pid , cid} = req.params; 

        const products = await ProductModel
        .find({
            category : cid,
            _id : { $ne : pid}
        })
        .select('-photo')
        .limit(3)
        .populate('category');

        res.status(200).json(
            {
                success : true,
                products
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.statu(400).json(
            {
                success : false,
                message : 'Error while fetching related Products',
                error
            }
        )    
    }
}

const getCategoryWiseProductsController = async(req,res) =>
{
    try
    {
        const category = await CategoryModel.findOne({slug : req.params.slug});
        const products = await ProductModel
        .find({category})
        .populate('category');

        res.status(200).json(
            {
                success : true,
                message : "Fetched Category wise Products Successfully",
                category,
                products
            }
        )
    }
    catch(error)
    {
        console.error(error);
        res.status(400).json(
            {
                success : false,
                message : "Error While Fetching Category Wise Products",
                error
            }
        )
    }
}

// Payment Gateway api
const braintreeTokenController = async (req,res) =>
{
    try 
    {
        gateway.clientToken.generate({},function(error , responnse)
        {
            if(error)
            {
                res.status(500).send(error);
            }
            else
            {
                res.status(200).send(responnse);
            }
        })    
    } 
    catch (error) 
    {
        console.error(error);    
    }
}

// payment api
const braintreePaymentsController = async (req,res) =>
{
    try 
    {
        const {cart , nonce} = req.body;

        let total = 0;

        cart.map( (i) => {total += i.price});

        let newTransaction = gateway.transaction.sale(
            {
                amount : total,
                paymentMethodNonce : nonce,
                options : {
                    submitForSettlement : true
                }
            },

            async function(error,result)
            {
                if(result)
                {
                    const order = new OrderModel({
                        products : cart,
                        payment : result,
                        buyer : req.user._id
                    });

                    await order.save();

                    res.json({ok : true});
                }
                else
                {
                    res.status(500).json(
                        {
                            ok : false,
                            error
                        }
                    )
                }
            }
        )
    } 
    catch (error) 
    {
        console.error(error);    
    }
}

module.exports = 
{
    createProductController , 
    getAllProductsController , 
    getSingleProductsController , 
    getProductsPhotoController , 
    deleteProductController , 
    updateProductController , 
    getFiltersProductController , 
    getRelatedProductsController ,
    getCategoryWiseProductsController,
    braintreeTokenController,
    braintreePaymentsController
};