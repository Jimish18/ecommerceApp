import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import  toast  from 'react-hot-toast';
import { Prices } from '../components/Prices';
import axios from 'axios';

const HomePage = () => {

  const [categories , setCategories] = useState([]);
  const [products , setProducts] = useState([]);
  const [checked , setChecked] = useState([]);
  const [radio , setRadio] = useState([]);

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
    if(!checked.length || !radio.length ) getAllProducts();
  },[checked.length,radio.length])

  useEffect(() =>
  {
    if(checked.length || radio.length) filterProducts();
  },[checked,radio])

  // Get Filtered Products 
  const filterProducts = async () =>
  {
    try 
    {
      const {data} = await  axios.post('api/v1/product/product-filters' , {checked,radio});
      
      setProducts(data?.products);
    } 
    catch (error) 
    {
      console.error(error);  
    }
  }

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

  const handleFilter = (value , id) =>
  {
    let all = [...checked];

    if(value)
    {
      all.push(id);
    }
    else
    {
      all = all.filter(c => c !== id);
    }

    setChecked(all);
  }

  return (
    <Layout>
      <div className="row my-3" style={{marginLeft : '0' , marginRight : '0'}}>
        <div className="col-md-3">

          {/* Category Filter  */}
          <div>
            <h5 className='text-center'>Filter by Category</h5>
            <div className="d-flex flex-column ps-4">
              {
                categories?.map(c =>
                (
                  <div className="form-check" key={c._id}>
                    <input className="form-check-input" type="checkbox" value={c._id} id="flexCheckDefault" onChange={(e) => handleFilter(e.target.checked , c._id)}/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                      {c.name}
                    </label>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Prices Filter */}
          <div className='my-4'>
            <h5 className='text-center'>Filter by Prices</h5>
            <div className="d-flex flex-column ps-4">

              {
                Prices.map( p =>
                (
                  <div className="form-check" key={p._id}>
                    <input className="form-check-input" type="radio" name="flexRadioDefault" value={p.array} onChange={() => setRadio(p.array)}/>
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                      {p.name}
                    </label>
                  </div>
                ))
              }

            <button className="btn btn-danger mt-3" onClick={() => {window.location.reload()}}>Reset Filter</button>
            </div>
          </div>


        </div>
        <div className="col-md-9">
          
         
          <h1 className='text-center'>All Products</h1>
          <div className="d-flex flex-wrap">

            {
              products.length ? 
              products.map(p =>
              (
                <div key={p._id} className="card m-3" style={{width : '18rem'}}>
                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} height={'300px'}/>
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text h6">{p.description.substring(0,100)}...</p>   
                      <h5 className="card-text my-3">{p.price} $</h5>   
                      <div className="button btn btn-primary ms-2">More Details</div>
                      <div className="button btn btn-secondary ms-2">Add To Cart</div>                                 
                    </div>
                </div>
              ))
              :
              (
                <div className='text-center w-100 my-5'>No Any Products are Available for Selected Category Or Price Range</div>
              )
              
            }

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage