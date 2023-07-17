import React , {useState , useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import  toast  from 'react-hot-toast';
import { useAuth } from '../../context/Auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    
    const [categoriesData , setCategoriesData] = useState([]);
    const [photo , setPhoto] = useState('');
    const [name , setName] = useState('');
    const [description , setDescription] = useState('');
    const [price , setPrice] = useState('');
    const [quantity , setQuantity] = useState('');
    const [category , setCategory] = useState(null);
    const [shipping , setShipping] = useState('');
    
    const [auth] = useAuth();
    const navigate = useNavigate();

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

    // API handle on Create Product
    const handleOnCreate = async () =>
    {
        const productData = new FormData();

        productData.append('name' , name);
        productData.append('description' , description);
        productData.append('price' , price);
        productData.append('category' , category);
        productData.append('photo' , photo);
        productData.append('quantity' , quantity);
        productData.append('shipping' , shipping);

        // const data = new URLSearchParams(productData);

        // We're Not Sending JSON format in this API 
        // We're sending a formData
        // Console ProductData (FormData)
        // for(var pair of productData.entries())
        // {
        //     console.log(pair[0] + " " + pair[1]);
        // }
        try 
        {
            // Lots of data handling error in fetch api
            // const response = await fetch('/api/v1/product/create-product',
            // {
            //     method : 'POST',
            //     headers :
            //     {
            //         Authorization : auth?.token,
            //         // 'Content-Type' : 'application/x-www-form-urlencoded'
            //         // 'Content-Type' : 'multipart/form-data; boundary=------some-random-characters' 
            //     },
            //     body : data
            // })

            // console.log(response);

            // const jsonData = await response.json();

            // console.log(jsonData);    

            // solved using axios
            const {data} = await axios.post('/api/v1/product/create-product', productData ,{
                headers :
                {
                    Authorization : auth?.token
                }
            })

            if(data?.success)
            {
                toast.success("Product Created Successfully");
                // navigate('/dashboard/admin/products');
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
                    <h1>Create Product</h1>

                    <div className="">
                        <select 
                            className="form-select" 
                            aria-label="Default select example" 
                            placeholder='Select Category...'
                            onChange={(e) => setCategory(e.target.value)}
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
                            photo && (
                                <div className="text-center">
                                    <img 
                                        src={URL.createObjectURL(photo)} 
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
                        >
                            <option value="" selected disabled>Select Shipping</option>
                            <option value='0'>No</option>
                            <option value='1'>Yes</option>
                        </select>
                    </div>

                    <div className="my-3">
                        <button type = 'submit' className="btn btn-primary" onClick={() => {handleOnCreate()}}>Create Product</button>
                    </div>

                </div>
            </div>
        </div>
    </Layout>
  )
}

export default CreateProduct