import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import  toast  from 'react-hot-toast';
import { useParams , useNavigate} from 'react-router-dom';

const ProductDetail = () => {

    const params = useParams();
    const [product , setProduct] = useState({});
    const [relatedProducts , setRelatedProducts] = useState([]);
    const navigate = useNavigate();

    const getProduct = async () =>
    {
        try 
        {
            const response = await fetch(`/api/v1/product/get-product/${params.slug}`, 
            {
                method : 'GET'
            })    

            const jsonData = await response.json();

            if(jsonData?.success)
            {
                setProduct(jsonData.product)
                getSimilarProducts(jsonData.product._id , jsonData?.product.category._id);
            }
        } 
        catch (error) 
        {
            console.error(error);
            toast.error('Failed To fetch Product Detail')
        }
    }

    useEffect(()=>
    {
        if(params?.slug) getProduct();
    },[params.slug])

    const getSimilarProducts = async (pid,cid) =>
    {
        try 
        {
            const response = await fetch(`/api/v1/product/related-product/${pid}/${cid}`,
            {
                method : 'GET'
            })    

            const jsonData = await response.json();

            if(jsonData?.success)
            {
                setRelatedProducts(jsonData.products);
            }
        } 
        catch (error) 
        {
            console.error(error);
        }
    }


  return (
    <Layout>
        
        <div className="row container mt-3 mx-auto" style={{marginLeft : '0' , marginRight : '0'}}>
            <div className="d-flex align-items-center col-md-6">
                <img src={`/api/v1/product/product-photo/${product._id}`} className="card-img-top"  height={'400px'} width={'300px'}/>
            </div>

            <div className="col-md-6">
                <h1>Product Details</h1>
                <h5 className='my-3'><span className='text-uppercase' style={{fontWeight : 'bold'}}>Name</span>  : {product.name}</h5>
                <h5 className='my-3'><span className='text-uppercase' style={{fontWeight : 'bold'}}>Description</span>   : {product.description}</h5>
                <h5 className='my-3'><span className='text-uppercase' style={{fontWeight : 'bold'}}>Price</span>   : $ {product.price}</h5>
                <h5 className='my-3'><span className='text-uppercase' style={{fontWeight : 'bold'}}>Category</span>   : {product?.category?.name}</h5>
                <h5 className='my-3'><span className='text-uppercase' style={{fontWeight : 'bold'}}>Quantity</span>   : {product.quantity}</h5>

                <button className="btn btn-secondary">Add To Cart</button>
            </div>
        </div>

        <div className="row container mx-auto">
            <h3>Similar Products</h3>
            <div className="container d-flex">
            {
                relatedProducts.map(p =>
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
        </div>
    </Layout>
  )
}

export default ProductDetail