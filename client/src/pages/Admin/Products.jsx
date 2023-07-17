import React, { useEffect, useState } from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import  toast  from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Products = () => {

    const [products , setProducts] = useState([]);

    const getAllProducts = async () =>
    {
        try 
        {
            const response = await fetch('/api/v1/product/get-products' , 
            {
                method : 'GET'
            })    ;

            const jsonData = await response.json();

            if(jsonData?.success)
            {
                setProducts(jsonData.products);
                toast.success("Fetched All Products Successfully");
            }
            else
            {
                toast.error(jsonData?.message);
            }
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Something went wrong while fetching All Products");
        }
    }

    useEffect(()=>
    {
        getAllProducts();
    },[])

  return (
    <Layout>
        <div className="container">
            <div className="row py-5">
                <div className="col-md-3">
                    <AdminMenu/>
                </div>
                <div className="col-md-9">
                    <h1>All Product List</h1>              

                    <div className="d-flex">
                    {
                        products?.map(p =>
                        (
                            <Link to={`/dashboard/admin/product/get-product/${p.slug}`} key={p._id} className='text-decoration-none'>
                                <div className="card m-3" style={{width : '18rem'}}>
                                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description}</p>                                    
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                    </div>

                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Products