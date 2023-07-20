import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useParams,useNavigate } from 'react-router-dom'
import  toast  from 'react-hot-toast';

const EachCategoryPage = () => {

    const params = useParams();
    const navigate = useNavigate();
    const [products , setProducts] = useState([]);
    const [category , setCategory] = useState({});

    const getCategoryWiseProducts = async () =>
    {
        try 
        {
            const response = await fetch(`/api/v1/product/product-category/${params.slug}`,
            {
                method : 'GET'
            })    

            const jsonData = await response.json();

            if(jsonData?.success)
            {
                setProducts(jsonData.products);
                setCategory(jsonData.category);
            }
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Error While fetching category wise products");
        }
    }

    useEffect(()=>
    {
      getCategoryWiseProducts();
    },[]);

  return (
    <Layout>
        <h1 className="text-center my-3 text-uppercase">{category.name}</h1>
        <div className="container d-flex flex-wrap">
        {
            products.map(p =>
              (
                <div key={p._id} className="card m-3" style={{width : '18rem'}}>
                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} height={'300px'}/>
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text h6">{p.description.substring(0,100)}...</p>   
                      <h5 className="card-text my-3">{p.price} $</h5>   
                      <div className="button btn btn-primary ms-2" onClick={() => navigate(`/product/${p.slug}`)}>More Details</div>
                      <div className="button btn btn-secondary ms-2">Add To Cart</div>                                 
                    </div>
                </div>
              ))
        }
        </div>
    </Layout>
  )
}

export default EachCategoryPage