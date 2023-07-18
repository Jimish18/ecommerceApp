import React , {useState , useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import  toast  from 'react-hot-toast';
import { useAuth } from '../../context/Auth';
import axios from 'axios';
import { useNavigate , useParams } from 'react-router-dom';

const UpdateProduct = () => {

    const [categoriesData , setCategoriesData] = useState([]);
    const [photo , setPhoto] = useState('');
    const [name , setName] = useState('');
    const [description , setDescription] = useState('');
    const [price , setPrice] = useState('');
    const [quantity , setQuantity] = useState('');
    const [category , setCategory] = useState(null);
    const [shipping , setShipping] = useState('');
    const [id,setId] = useState('');
    
    const [auth] = useAuth();
    const navigate = useNavigate();
    const params = useParams();

    // get Single Product
    const getSingleProduct = async() =>
    {
        try 
        {
            const response = await fetch(`/api/v1/product/get-product/${params.slug}` , 
            {
                method : 'GET'
            })    

            const jsonData = await response.json();

            setName(jsonData.product.name);
            setDescription(jsonData.product.description);
            setPrice(jsonData.product.price);
            setQuantity(jsonData.product.quantity);
            setShipping(jsonData.product.shipping);
            setCategory(jsonData.product.category._id);
            setPhoto(jsonData.product.photo);
            setId(jsonData.product._id);
        } 
        catch (error) 
        {
            console.error(error);    
        }
    }

    useEffect(()=>
    {
        getSingleProduct();
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

            // console.log(jsonData);

            const {categories} = jsonData;
            if(jsonData?.success)
            {
                setCategoriesData(categories);
            }

            // console.log(categoriesData)
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Something went Wrong while Fetching All Categories");   
        }
    };

    useEffect(() =>
    {
        getAllCategories();
    }, [])

    // API call to delete Product
    const handleOnDelete = async () =>
    {
        try 
        {
            const answer = window.confirm("Are your sure want to delete this product ?");
            if( !answer) return;

            const response = await fetch(`/api/v1/product/delete-product/${id}` , 
            {
                method : 'DELETE',
                headers :
                {
                    Authorization : auth?.token
                }
            })    

            const jsonData = await response.json();

            if(jsonData?.success)
            {
                toast.success(`${jsonData.message}`);
                navigate('/dashboard/admin/products');
            }
        } 
        catch (error) 
        {
            console.error(error);
            toast.error('Error While Deleting Product');    
        }
    }

    // API handle on Create Product
    const handleOnUpdate = async () =>
    {
        const productData = new FormData();

        productData.append('name' , name);
        productData.append('description' , description);
        productData.append('price' , price);
        productData.append('category' , category);
        photo && productData.append('photo' , photo);
        productData.append('quantity' , quantity);
        productData.append('shipping' , shipping);

        
        try 
        {
            

            // solved using axios
            const {data} = await axios.put(`/api/v1/product/update-product/${id}`, productData ,{
                headers :
                {
                    Authorization : auth?.token
                }
            })

            if(data?.success)
            {
                toast.success("Product Created Successfully");
                navigate('/dashboard/admin/products');
            }
            else
            {
                toast.error(data?.message);
            }

            
        } 
        catch (error) 
        {
            console.error(error);
            toast.error("Something Went Wrong While Creating Product");    
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
                    <h1>Update Product</h1>

                    <div className="">
                        <select 
                            className="form-select" 
                            aria-label="Default select example" 
                            placeholder='Select Category...'
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            // defaultValue={category}
                        >
                            <option selected disabled>Select Category</option>
                            
                            {
                                categoriesData?.map((c) =>
                                {
                                    return(
                                        <option value={c._id} key={c._id}>{c.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="my-3">
                        <label  className="btn btn-outline-secondary col-md-12">
                            {photo ? photo.name : 'Upload Photo'}
                            <input 
                                type="file" 
                                name="photo" 
                                accept='image/*' 
                                onChange={(e) => setPhoto(e.target.files[0])}
                                hidden
                            />
                        </label>
                    </div>

                    {/* Div For Selected Image Preview */}
                    <div className="my-3">
                        {
                            photo ? (
                                <div className="text-center">
                                    <img 
                                        src={URL.createObjectURL(photo)} 
                                        alt="Product Photo" 
                                        className="img img-responsive" 
                                        height={'200px'}
                                    />
                                </div>
                            )
                            :
                            (
                                <div className="text-center">
                                    <img 
                                        src={`/api/v1/product/product-photo/${id}`}
                                        alt="Product Photo" 
                                        className="img img-responsive" 
                                        height={'200px'}
                                    />
                                </div>
                            )
                        }
                    </div>

                    <div className="my-2">
                        <input 
                            type="text"
                            className='form-control'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter Name...'
                        />
                    </div>

                    <div className="my-2">
                        <textarea 
                            cols="30" 
                            rows="2" 
                            className='form-control'
                            placeholder='Add Description...'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        >
                        </textarea>
                    </div>

                    <div className="my-2">
                        <input
                            type="number"
                            value={price}
                            placeholder="Enter Price"
                            className="form-control"
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="my-2">
                        <input
                            type="number"
                            value={quantity}
                            placeholder="write a quantity"
                            className="form-control"
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="my-2">
                        <select 
                            className="form-select" 
                            aria-label="Default select example" 
                            placeholder='Select Category...'
                            onChange={(e) => setShipping(e.target.value)}
                            value={shipping}
                        >
                            <option value="" selected disabled>Select Shipping</option>
                            <option value='0'>No</option>
                            <option value='1'>Yes</option>
                        </select>
                    </div>

                    <div className="my-3">
                        <button type = 'submit' className="btn btn-primary" onClick={() => {handleOnUpdate()}}>Update Product</button>
                        <button type = 'submit' className="btn btn-danger mx-2" onClick={() => {handleOnDelete()}}>Delete Product</button>
                    </div>

                </div>
            </div>
        </div>
    </Layout>
  )
}

export default UpdateProduct