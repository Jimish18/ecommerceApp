import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import  toast  from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CategoryPage = () => {

    const [categories , setCategories] = useState([]);

    // Function to Fetch All the Categories By Sending API request
    const getAllCategories = async () =>
    {
        try 
        {
        const response = await fetch('/api/v1/category/categories',{
            method : 'GET'
        });

        const jsonData = await response.json();
        
        if(jsonData?.success)
        {
            setCategories(jsonData.categories);
        }

        } 
        catch (error) 
        {
        console.error(error);
        toast.error("Something went Wrong while Fetching All Categories");   
        }
    }

    useEffect(() =>
    {
        getAllCategories();
    }, [])


  return (
    <Layout>
        <h1 className='text-center mt-3'>Different Categories</h1>
        <div className="container">
            <div className="row mt-5">
                {
                    categories?.map(c =>
                    (                        
                        <div className="col-md-3 col-sm-12 my-2" key={c._id}>
                            <Link 
                            to={`/category/${c.slug}`}
                            className='h4 text-decoration-none btn btn-primary w-100'>
                                {c.name}
                                
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    </Layout>
  )
}

export default CategoryPage