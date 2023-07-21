import React , {useState , useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import  toast  from 'react-hot-toast';
import { useAuth } from '../../context/Auth';
import moment from 'moment';
import axios from 'axios'

const AdminOrders = () => {

    const [status , setStatus] = useState(['Not Process','Processing','Shipped','deliverd','cancel']);
    const [changeStatus , setChangeStatus] = useState("");
    const [orders,setOrders] = useState([]);
    const [auth] = useAuth();

    const getAllOrders = async () =>
    {
        try 
        {
            const response = await fetch('/api/v1/auth/all-orders',
            {
                method : 'GET',
                headers :
                {
                    Authorization : auth?.token
                }
            });

            const jsonData = await response.json();

            if(jsonData?.success)
            {
                setOrders(jsonData?.orders);
            }
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Error while fetching All Orders");    
        }
    }

    useEffect(()=>
    {
        getAllOrders();
    },[auth?.token]);

    const handleChange = async (orderId,value) =>
    {
        try 
        {
            const {data} = await axios.put(`/api/v1/auth/order-status/${orderId}` , {status : value},
            {
                headers :
                {
                    Authorization : auth?.token
                }
            })

            getAllOrders();
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Error while updating order status");
        }
    }
  return (
    <Layout>
        <div className="container">
            <div className="row py-5">
                <div className="col-md-3">
                    <AdminMenu/>
                </div>
                <div className="col-md-9">
                    <h1 >All Orders</h1>

                    {
                        orders.map((o,i) =>
                        {
                            return (
                                <div className="border shadow">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope='col'>#</th>
                                                <th scope='col'>Status</th>
                                                <th scope='col'>Buyer</th>
                                                <th scope='col'>Date</th>
                                                <th scope='col'>Paymnet</th>
                                                <th scope='col'>Quantity</th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>
                                                <td>{i+1}</td>
                                                <td>
                                                    <select className="form-select" aria-label="Default select example" onChange={(e) => handleChange(o._id,e.target.value)}>
                                                        <option selected>Open this select menu</option>
                                                        
                                                        {
                                                            status.map((s,i) =>
                                                            (
                                                                <option key={i} value={s}>{s}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </td>
                                                <td>{o?.buyer?.name}</td>
                                                <td>{moment(o?.createdAt).fromNow()}</td>
                                                <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                                <td>{o?.products?.length}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="container">
                                    {
                                        o?.products?.map((p,i) =>
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
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default AdminOrders