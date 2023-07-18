import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/Auth'
import  toast  from 'react-hot-toast';

const HomePage = () => {

  const [auth,setAuth] = useAuth();
  const [categories , setCategories] = useState([]);
  const [products , setProducts] = useState([]);

  const getAllProducts = async () =>
  {
    try 
    {
      const response = await fetch('/api/v1/product//get-products',
      {
        method : 'GET'
      })  

      const jsonData = await response.json();

      if(jsonData?.success)
      {
        setProducts(jsonData?.products)
      }
    } 
    catch (error) 
    {
      console.error(error);
      toast.error("Something went wrong while fetching all Products");
    }
  } 

  useEffect(()=>
  {
    getAllProducts();
  },[])

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
      <div className="row my-3">
        <div className="col-md-3">
          <h5 className='text-center'>Filter by Category</h5>
        </div>
        <div className="col-md-9">
          <h1 className='text-center'>All Products</h1>
          <div className="d-flex flex-wrap">

            {
              products?.map(p =>
              (
                <div key={p._id} className="card m-3" style={{width : '18rem'}}>
                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} height={'300px'}/>
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text h-50 h6">{p.description}</p>   
                      <div className="button btn btn-primary ms-2">More Details</div>
                      <div className="button btn btn-secondary ms-2">Add To Cart</div>                                 
                    </div>
                </div>
              ))
            }

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage