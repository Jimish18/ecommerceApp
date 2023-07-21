import React, { useState , useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import { useCart } from '../context/Cart'
import { useAuth } from '../context/Auth'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import  toast  from 'react-hot-toast'
import DropIn from 'braintree-web-drop-in-react'

const CartPage = () => {

    const [cart,setCart] = useCart();
    const [auth,setAuth] = useAuth();
    const [clientToken , setClientToken] = useState("");
    const [instance , setInstance] = useState("");
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();

    const removeCartItem = (pid) =>
    {
        let myCart = [...cart];

        myCart = myCart.filter((p) => p._id !== pid);

        setCart(myCart);
        localStorage.setItem("cart" , JSON.stringify(myCart));
    }

    const calcTotalAmount = () =>
    {
        let total = 0;

        cart?.map(p => {total = total + p.price});

        return total.toLocaleString("en-US",
        {
            style : "currency",
            currency : "USD"
        })
    }

    // get payment gateway token
    const getToken = async () =>
    {
        try 
        {
            const data = await fetch('/api/v1/product/braintree/token',
            {
                method : 'GET' 
            })   
            
            const jsonData = await data.json();

            setClientToken(jsonData?.clientToken);
        } 
        catch (error) 
        {
            console.error(error);    
        }
    }

    useEffect(()=>
    {
        getToken();        
    },[auth?.token])

    const handlePayment = async () =>
    {
        try 
        {
            setLoading(true);
            const {nonce} = await instance.requestPaymentMethod();  

            const {data} = await axios.post('/api/v1/product/braintree/payment'
            ,
            {
                nonce,
                cart,
            } ,
            {
                headers : 
                {
                    Authorization : auth?.token
                }
            }
            ) ;        
            

            setLoading(false);

            localStorage.removeItem('cart');
            setCart([]);
            navigate('/dashboard/user/orders');
            toast.success('Payment Done Successfully');

        } 
        catch (error) 
        {
            console.error(error); 
            setLoading(false);  
            toast.error("Error while processing payment"); 
        }
    }

  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-center p-2 my-2">
                        {
                            `Hello  ${auth?.token && auth?.user?.name.toUpperCase()}`
                        }
                    </h1>
                    <h5 className="text-center mb-4">
                        {
                            cart?.length > 0 ? 
                            `You have ${cart.length} items in your Cart ${auth?.token ? "" : ", Please Login to checkout Items" }`
                            :
                            `Your Cart is Empty.`                           
                            
                        }
                    </h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    {
                        cart?.map((p) =>
                        (
                            <div className="row card mb-4 flex-row" key={p._id}>
                                <div className="col-md-4">
                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} height={'250px'}/>
                                </div>
                                <div className="col-md-8">

                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text h6">{p.description.substring(0,100)}...</p>   
                                        <h5 className="card-text my-3">${p.price}</h5>   
                                        <div className="button btn btn-primary" onClick={() => navigate(`/product/${p.slug}`)}>More Details</div>
                                        <div className="button btn btn-danger ms-2" onClick={() => removeCartItem(p._id)}>Remove Item</div>                                        
                                        
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="col-md-4 text-center">
                    <h2>Cart Summary</h2>
                    <p>Total | CheckOut | Payment</p>
                    <hr />
                    <h4>Total Amout : {calcTotalAmount()}</h4>

                    {
                        auth?.user?.address ? 
                        (
                            <div className='my-2'>
                                <h4>Current Address :</h4>
                                <h5>{auth?.user?.address}</h5>

                                <button 
                                    className="btn btn-outline-warning"
                                    onClick={()=> navigate('/dashboard/user/profile')}
                                >
                                    Update Address
                                </button>
                            </div>
                        ) 
                        :
                        (
                            <div className='my-2'>
                                {
                                    auth?.token ? 
                                    (
                                        <button 
                                            className="btn btn-outline-warning"
                                            onClick={()=> navigate('/dashboard/user/profile')}
                                        >
                                        Update Address
                                        </button>
                                    )
                                    :
                                    (
                                        <button 
                                            className="btn btn-outline-warning"
                                            onClick={()=> navigate('/login' , { state : "/cart"})}
                                        >
                                        Please Login
                                        </button>
                                    )
                                }
                            </div>
                        )
                    }

                    <div className="my-2">
                        {
                           !clientToken || !cart?.length ?
                           (
                            ""
                           )
                           :
                           (
                            <>
                                <DropIn
                                    options={{
                                        authorization : clientToken,
                                        paypal : 
                                        {
                                            flow : 'vault'
                                        }
                                    }}
                                    onInstance={instance => setInstance(instance)}
                                />

                                <button 
                                    className='btn btn-primary' 
                                    onClick={handlePayment}
                                    disabled = {!clientToken   || !instance || !auth?.user?.address}
                                >
                                {
                                    loading ? "Processing..." : "Make Payment"
                                }
                                </button>
                            </>
                           ) 
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CartPage