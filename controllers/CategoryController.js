const  slugify  = require("slugify");
const CategoryModel = require("../models/CategoryModel");

const createCategoryController = async (req,res) =>
{
    try 
    {
        const name = req.body.name;

        console.log(name);
        
        if(!name)
        {
            return res.status(401).json(
                {
                    message : "Category name is Required"
                }
            )
        }

        const existingCategory = await CategoryModel.findOne({name});
        if(existingCategory)
        {
            return res.status(200).json(
                {
                    success : true,
                    message : "Category Already Exist"
                }
            )
        }

        const category = await new CategoryModel({name , slug : slugify(name)}).save();
        res.status(201).json(
            {
                success : true,
                message : "Category Created Successfully",
                category
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : "Error in Category Creation",
                error
            }
        )   
    }
}

const updateCategoryController = async (req,res) =>
{
    try 
    {
        const {name} = req.body;
        const {id} = req.params;
        
        const category = await CategoryModel.findByIdAndUpdate(id ,
            {
                name , slug : slugify(name) 
            }
            ,
            {
                new : true
            });

        res.status(200).json(
            {
                success : true,
                message : "Category Updated Successfully",
                category
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : "Error in Category Updation",
                error
            }
        )
            
    }
}

const getCategoriesController = async (req,res) =>
{
    try 
    {
        const categories = await CategoryModel.find({});  
        
        res.status(200).json(
            {
                success : true,
                message : "Successfully Fetched All Categories",
                categories
            }
        )
    } 
    catch (error) 
    {
        res.status(500).json(
            {
                success : false,
                message : "Error In Getting Categories",
                error
            }
        )    
    }
}

const getSingleCategoryController = async (req,res) =>
{
    try 
    {
        const category = await CategoryModel.findOne({slug : req.params.slug});  
        
        res.status(200).json(
            {
                success : true,
                message : "Successfully Fetched Single Category",
                category
            }
        )
    } 
    catch (error) 
    {
        res.status(500).json(
            {
                success : false,
                message : "Error In Getting Category",
                error
            }
        )    
    }
}

const deleteSingleCategoryController = async (req,res) =>
{
    try 
    {
        const {id} = req.params;

               
        const category = await CategoryModel.findByIdAndDelete(id);
        res.status(200).json(
            {
                success : true,
                message : "Category Deleted Successfully"
            }
        )
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json(
            {
                success : false,
                message : "Error While Deleting Category",
                error
            }
        )    
    }
}

module.exports = {createCategoryController , updateCategoryController , getCategoriesController , getSingleCategoryController , deleteSingleCategoryController};